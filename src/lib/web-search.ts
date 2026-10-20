import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const MCP_URL = "https://search.parallel.ai/mcp";
const USER_AGENT = "nextjs-ollama-llm-ui/0.1.0 (+https://github.com/jakobhoeg/nextjs-ollama-llm-ui)";

// The caller supplies the chat's opaque UUID, independently of the MCP connection.
// A new connection per request cannot share mutable context between conversations.
export async function searchWeb(query: string, chatId: string, signal: AbortSignal) {
  const controller = new AbortController();
  const abort = () => controller.abort(signal.reason);
  signal.addEventListener("abort", abort, { once: true });
  if (signal.aborted) abort();
  const timeout = setTimeout(() => {
    controller.abort(new DOMException("Web search timed out", "TimeoutError"));
  }, 15_000);
  const client = new Client({ name: "nextjs-ollama-llm-ui", version: "0.1.0" });
  const options = { signal: controller.signal, timeout: 15_000 };

  try {
    controller.signal.throwIfAborted();
    const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
      requestInit: { headers: { "User-Agent": USER_AGENT }, redirect: "error" },
      fetch: (url, init) => fetch(url, {
        ...init,
        signal: AbortSignal.any([controller.signal, ...(init?.signal ? [init.signal] : [])]),
      }),
    });
    await client.connect(transport, options);
    const { tools } = await client.listTools({}, options);
    if (!tools.some((tool) => tool.name === "web_search")) {
      throw new Error("Web search tool is unavailable");
    }
    const result = CallToolResultSchema.parse(await client.callTool({
      name: "web_search",
      arguments: { objective: query, search_queries: [query], session_id: chatId },
    }, CallToolResultSchema, options));
    if (result.isError) throw new Error("Web search failed");
    const text = result.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("\n")
      .slice(0, 25_000);
    if (!text.trim()) throw new Error("Web search returned no text");
    return text;
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason;
    throw error;
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
    await client.close();
  }
}
