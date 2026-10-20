import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { randomUUID } from "node:crypto";
import { POST } from "../src/app/api/chat/route";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const source = { title: "Ollama documentation", url: "https://docs.ollama.com/", excerpts: ["Run models locally."] };
type RequestRecord = { url: string; headers: Headers; body?: any; method?: string };

function fixture(options: { toolError?: boolean; httpError?: number; empty?: boolean; missingTool?: boolean; invalid?: boolean; hang?: boolean; sse?: boolean } = {}) {
  const calls: RequestRecord[] = [];
  process.env.OLLAMA_URL = "http://ollama.test:11434";
  delete process.env.WEB_SEARCH_ENABLED;
  // Keys must never be read or forwarded by the anonymous provider.
  process.env.PARALLEL_API_KEY = "ambient-key-must-not-be-used";
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.startsWith("data:")) return originalFetch(input, init);
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    const headers = new Headers(init?.headers);
    calls.push({ url, headers, body, method: init?.method });
    if (url === "http://ollama.test:11434/api/chat") {
      const context = body.messages.find((message: any) => message.role === "system");
      const text = context ? `[Ollama](${source.url}) supports local models.` : "Offline answer.";
      return new Response([
        { model: body.model, created_at: new Date().toISOString(), done: false, message: { role: "assistant", content: text } },
        { model: body.model, created_at: new Date().toISOString(), done: true, eval_count: 5, eval_duration: 1, total_duration: 1 },
      ].map((chunk) => JSON.stringify(chunk)).join("\n") + "\n", { headers: { "Content-Type": "application/x-ndjson" } });
    }
    assert.equal(url, "https://search.parallel.ai/mcp");
    assert.match(headers.get("user-agent")!, /^nextjs-ollama-llm-ui\/0\.1\.0 /);
    assert.equal(headers.get("authorization"), null);
    assert.equal(init?.redirect, "error");
    if (init?.method === "GET") return new Response(null, { status: 405 });
    if (body.method === "notifications/initialized") return new Response(null, { status: 202 });
    let result: any;
    if (body.method === "initialize") {
      result = { protocolVersion: "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "fixture", version: "1" } };
    } else if (body.method === "tools/list") {
      result = { tools: options.missingTool ? [] : [{ name: "web_search", inputSchema: { type: "object" } }] };
    } else {
      assert.equal(body.method, "tools/call");
      if (options.hang) {
        return new Promise<Response>((_, reject) => {
          if (init?.signal?.aborted) reject(init.signal.reason);
          init?.signal?.addEventListener("abort", () => reject(init.signal!.reason), { once: true });
        });
      }
      if (options.httpError) return new Response("Search unavailable", { status: options.httpError });
      if (options.invalid) return new Response("invalid", { headers: { "Content-Type": "application/json" } });
      result = { isError: options.toolError || false, content: options.empty ? [] : [{ type: "text", text: JSON.stringify({ results: [source] }) }] };
    }
    const response = { jsonrpc: "2.0", id: body.id, result };
    return options.sse
      ? new Response(`event: message\ndata: ${JSON.stringify(response)}\n\n`, { headers: { "Content-Type": "text/event-stream" } })
      : Response.json(response);
  };
  return calls;
}

function request(extra: Record<string, unknown> = {}, signal?: AbortSignal) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages: [{ role: "user", content: "What is Ollama?" }], selectedModel: "chosen-local-model", ...extra }),
    signal,
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv };
});

test("fresh and explicitly disabled chat remain offline and preserve the model", async () => {
  const calls = fixture();
  for (const extra of [{}, { webSearchEnabled: false }, { webSearchEnabled: "true" }]) {
    const response = await POST(request(extra));
    assert.match(await response.text(), /Offline answer/);
  }
  assert.equal(calls.length, 3);
  assert(calls.every((call) => call.url === "http://ollama.test:11434/api/chat" && call.body.model === "chosen-local-model"));
});

test("permission uses anonymous default through discovery, search, Ollama input and streamed citation", async () => {
  const calls = fixture();
  const chatId = randomUUID();
  const response = await POST(request({ webSearchEnabled: true, chatId, messages: [
    { role: "user", content: "Private earlier message" },
    { role: "assistant", content: "Earlier reply" },
    { role: "user", content: "What is Ollama?" },
  ] }));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /https:\/\/docs\.ollama\.com\//);
  const search = calls.find((call) => call.body?.method === "tools/call")!;
  assert.deepEqual(search.body.params, { name: "web_search", arguments: {
    objective: "What is Ollama?", search_queries: ["What is Ollama?"], session_id: chatId,
  } });
  assert(!JSON.stringify(search).includes("Private earlier message"));
  const model = calls.find((call) => call.body?.model)!;
  assert.match(model.body.messages[0].content, /untrusted reference/);
  assert.match(model.body.messages[0].content, /https:\/\/docs\.ollama\.com\//);
  assert.match(model.body.messages[0].content, /Run models locally/);
  assert.equal(model.body.messages[1].content, "Private earlier message");
  assert(calls.some((call) => call.body?.method === "tools/list"));
});

test("images stay in the Ollama request and are never sent to search", async () => {
  const calls = fixture();
  const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X8N8AAAAASUVORK5CYII=";
  const response = await POST(request({ webSearchEnabled: true, chatId: randomUUID(), data: { images: [image] } }));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /https:\/\/docs\.ollama\.com\//);
  const search = calls.find((call) => call.body?.method === "tools/call")!;
  assert(!JSON.stringify(search.body).includes("base64"));
  const model = calls.find((call) => call.body?.model)!;
  assert.deepEqual(model.body.messages.at(-1).images, [image.split(",")[1]]);
});

test("SDK consumes streamable HTTP SSE replies as well as JSON", async () => {
  fixture({ sse: true });
  const response = await POST(request({ webSearchEnabled: true, chatId: randomUUID() }));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /https:\/\/docs\.ollama\.com\//);
});

test("administrator prohibition and invalid conversation/input fail before remote access", async () => {
  const calls = fixture();
  process.env.WEB_SEARCH_ENABLED = "false";
  assert.equal((await POST(request({ webSearchEnabled: true, chatId: randomUUID() }))).status, 403);
  delete process.env.WEB_SEARCH_ENABLED;
  for (const extra of [{ chatId: "user@example.com" }, { chatId: randomUUID(), messages: [{ role: "user", content: " " }] },
    { chatId: randomUUID(), messages: [{ role: "user", content: "x".repeat(10_001) }] }]) {
    assert.equal((await POST(request({ webSearchEnabled: true, ...extra }))).status, 400);
  }
  assert.equal(calls.length, 0);
});

for (const options of [{ toolError: true }, { httpError: 429 }, { httpError: 401 }, { invalid: true }, { missingTool: true }, { empty: true }]) {
  test(`search failure ${JSON.stringify(options)} is visible without silent offline fallback`, async () => {
    const calls = fixture(options);
    const response = await POST(request({ webSearchEnabled: true, chatId: randomUUID() }));
    assert.equal(response.status, 502);
    assert.match(await response.text(), /turn off Web search/);
    assert(!calls.some((call) => call.body?.model));
  });
}

test("interleaved conversations, followups, regeneration and retry retain their chat UUID", async () => {
  let calls = fixture({ httpError: 429 });
  const first = randomUUID(), second = randomUUID(), reset = randomUUID();
  assert.equal((await POST(request({ webSearchEnabled: true, chatId: first }))).status, 502);
  const quotaId = calls.find((call) => call.body?.method === "tools/call")!.body.params.arguments.session_id;
  calls = fixture();
  const ids = [first, second, first, reset, second];
  await Promise.all(ids.map(async (chatId) => {
    const response = await POST(request({ webSearchEnabled: true, chatId }));
    await response.text();
  }));
  const received = calls.filter((call) => call.body?.method === "tools/call").map((call) => call.body.params.arguments.session_id);
  assert.deepEqual(received.sort(), ids.sort());
  assert.equal(quotaId, first);
  assert.equal(new Set(received).size, 3);
});

test("Stop aborts MCP work before any model request", async () => {
  const calls = fixture({ hang: true });
  const controller = new AbortController();
  const pending = POST(request({ webSearchEnabled: true, chatId: randomUUID() }, controller.signal));
  while (!calls.some((call) => call.body?.method === "tools/call")) await new Promise((resolve) => setImmediate(resolve));
  controller.abort();
  assert.equal((await pending).status, 499);
  assert(!calls.some((call) => call.body?.model));
});

test("15-second search deadline releases the request without model fallback", { timeout: 20_000 }, async () => {
  const calls = fixture({ hang: true });
  const pending = POST(request({ webSearchEnabled: true, chatId: randomUUID() }));
  while (!calls.some((call) => call.body?.method === "tools/call")) await new Promise((resolve) => setImmediate(resolve));
  assert.equal((await pending).status, 504);
  assert(!calls.some((call) => call.body?.model));
});
