import { StreamingTextResponse } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages, chainType } = await req.json();
  console.debug("--chain-->", chainType);

  const response = await fetch(`${process.env.AI_API_URL}/db/chat`, {
    method: "POST",
    body: JSON.stringify({ messages, chain_type: chainType }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response.body ? new StreamingTextResponse(response.body) : null;
}
