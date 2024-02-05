import { StreamingTextResponse, Message } from "ai";
import { ChatOllama } from "langchain/chat_models/ollama";
import { AIMessage, HumanMessage } from "langchain/schema";
import { BytesOutputParser } from "langchain/schema/output_parser";


export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: "phi",
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