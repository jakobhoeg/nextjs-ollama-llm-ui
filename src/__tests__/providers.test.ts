import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isMiniMaxModel, getMiniMaxModels, getLanguageModel } from "@/lib/providers";

describe("isMiniMaxModel", () => {
  it("returns true for MiniMax-M2.7", () => {
    expect(isMiniMaxModel("MiniMax-M2.7")).toBe(true);
  });

  it("returns true for MiniMax-M2.7-highspeed", () => {
    expect(isMiniMaxModel("MiniMax-M2.7-highspeed")).toBe(true);
  });

  it("returns false for Ollama models", () => {
    expect(isMiniMaxModel("llama3:latest")).toBe(false);
    expect(isMiniMaxModel("gemma:2b")).toBe(false);
    expect(isMiniMaxModel("mistral")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isMiniMaxModel("")).toBe(false);
  });

  it("returns false for partial match", () => {
    expect(isMiniMaxModel("MiniMax")).toBe(false);
    expect(isMiniMaxModel("minimax-m2.7")).toBe(false);
  });
});

describe("getMiniMaxModels", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns models when MINIMAX_API_KEY is set", () => {
    process.env.MINIMAX_API_KEY = "test-key";
    const models = getMiniMaxModels();
    expect(models).toEqual(["MiniMax-M2.7", "MiniMax-M2.7-highspeed"]);
  });

  it("returns empty array when MINIMAX_API_KEY is not set", () => {
    delete process.env.MINIMAX_API_KEY;
    const models = getMiniMaxModels();
    expect(models).toEqual([]);
  });

  it("returns a new array each call (no mutation risk)", () => {
    process.env.MINIMAX_API_KEY = "test-key";
    const a = getMiniMaxModels();
    const b = getMiniMaxModels();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

describe("getLanguageModel", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns a model instance for MiniMax-M2.7", () => {
    process.env.MINIMAX_API_KEY = "test-key";
    const model = getLanguageModel("MiniMax-M2.7");
    expect(model).toBeDefined();
    expect(model.modelId).toBe("MiniMax-M2.7");
  });

  it("returns a model instance for MiniMax-M2.7-highspeed", () => {
    process.env.MINIMAX_API_KEY = "test-key";
    const model = getLanguageModel("MiniMax-M2.7-highspeed");
    expect(model).toBeDefined();
    expect(model.modelId).toBe("MiniMax-M2.7-highspeed");
  });

  it("returns a model instance for Ollama model", () => {
    process.env.OLLAMA_URL = "http://localhost:11434";
    const model = getLanguageModel("llama3:latest");
    expect(model).toBeDefined();
  });

  it("uses default OLLAMA_URL when not set", () => {
    delete process.env.OLLAMA_URL;
    const model = getLanguageModel("gemma:2b");
    expect(model).toBeDefined();
  });

  it("uses default MiniMax base URL when MINIMAX_BASE_URL is not set", () => {
    process.env.MINIMAX_API_KEY = "test-key";
    delete process.env.MINIMAX_BASE_URL;
    const model = getLanguageModel("MiniMax-M2.7");
    expect(model).toBeDefined();
  });

  it("uses custom MiniMax base URL when set", () => {
    process.env.MINIMAX_API_KEY = "test-key";
    process.env.MINIMAX_BASE_URL = "https://custom.api.com/v1";
    const model = getLanguageModel("MiniMax-M2.7");
    expect(model).toBeDefined();
  });
});
