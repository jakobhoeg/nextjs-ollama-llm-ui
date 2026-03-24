import { describe, it, expect } from "vitest";

const API_KEY = process.env.MINIMAX_API_KEY;
const BASE_URL = process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1";

describe.skipIf(!API_KEY)("MiniMax Integration", () => {
  it("completes a basic chat request with MiniMax-M2.7", async () => {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        messages: [{ role: "user", content: 'Say "hello" and nothing else.' }],
        max_tokens: 20,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.choices).toBeDefined();
    expect(data.choices[0].message.content).toBeTruthy();
  }, 30000);

  it("completes a streaming chat request", async () => {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        messages: [{ role: "user", content: 'Say "test" and nothing else.' }],
        max_tokens: 20,
        stream: true,
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toContain("text/event-stream");

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let receivedData = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      if (chunk.includes("data:")) {
        receivedData = true;
        break;
      }
    }
    reader.cancel();

    expect(receivedData).toBe(true);
  }, 30000);

  it("completes a request with MiniMax-M2.7-highspeed", async () => {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7-highspeed",
        messages: [{ role: "user", content: 'Say "ok" and nothing else.' }],
        max_tokens: 20,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.choices).toBeDefined();
    expect(data.choices[0].message.content).toBeTruthy();
  }, 30000);
});
