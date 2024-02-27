import { StreamingTextResponse, Message } from "ai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";


export async function GET(req: Request) {
  const res = await fetch(
    process.env.OLLAMA_URL + "/api/tags"
  );
  return new Response(await res.text());
}
