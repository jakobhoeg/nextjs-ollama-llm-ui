import { streamText, convertToCoreMessages, UserContent } from 'ai';
import { getLanguageModel, isMiniMaxModel } from '@/lib/providers';

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, selectedModel, data } = await req.json();

  const initialMessages = messages.slice(0, -1);
  const currentMessage = messages[messages.length - 1];

  const model = getLanguageModel(selectedModel);

  const messageContent: UserContent = [{ type: 'text', text: currentMessage.content }];

  // Add images if they exist (not supported by MiniMax)
  if (!isMiniMaxModel(selectedModel)) {
    data?.images?.forEach((imageUrl: string) => {
      const image = new URL(imageUrl);
      messageContent.push({ type: 'image', image });
    });
  }

  const result = await streamText({
    model,
    messages: [
      ...convertToCoreMessages(initialMessages),
      { role: 'user', content: messageContent },
    ],
  });

  return result.toDataStreamResponse();
}
