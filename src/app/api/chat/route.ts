import { createOllama } from 'ollama-ai-provider';
import { streamText, convertToCoreMessages, CoreMessage } from 'ai'

export const runtime = "edge";
export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  const { messages, selectedModel } = await req.json();

  const coreMessages = convertToCoreMessages(messages);

  const ollama = createOllama({
  });

  const result = await streamText({
    model: ollama(selectedModel),
    messages: [
      ...coreMessages
    ],
    system: 'You are a helpful chatbot.',
  });

  return result.toDataStreamResponse()
}
