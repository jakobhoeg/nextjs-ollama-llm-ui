import { createOllama } from "ollama-ai-provider";
import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

const MINIMAX_MODELS = ["MiniMax-M2.7", "MiniMax-M2.7-highspeed"];

export function isMiniMaxModel(model: string): boolean {
  return MINIMAX_MODELS.includes(model);
}

export function getMiniMaxModels(): string[] {
  if (!process.env.MINIMAX_API_KEY) return [];
  return [...MINIMAX_MODELS];
}

export function getLanguageModel(selectedModel: string): LanguageModelV1 {
  if (isMiniMaxModel(selectedModel)) {
    const minimax = createOpenAI({
      apiKey: process.env.MINIMAX_API_KEY,
      baseURL: process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1",
    });
    return minimax(selectedModel);
  }

  const ollama = createOllama({
    baseURL: (process.env.OLLAMA_URL || "http://localhost:11434") + "/api",
  });
  return ollama(selectedModel);
}
