import { StreamingTextResponse, Message } from "ai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";


export async function POST(req: Request) {
  const { messages, selectedModel } = await req.json();

  const model = new ChatOllama({
    baseUrl: process.env.NEXT_PUBLIC_OLLAMA_URL,
    model: selectedModel,
  });

  const parser = new BytesOutputParser();

  const stream = await model
    .pipe(parser)
    .stream(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      )
    );

    console.log(stream);

  return new StreamingTextResponse(stream);
}