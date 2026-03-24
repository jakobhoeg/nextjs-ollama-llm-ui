import { getMiniMaxModels } from "@/lib/providers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const OLLAMA_URL = process.env.OLLAMA_URL;
  const minimaxModels = getMiniMaxModels();

  let ollamaModels: { name: string }[] = [];
  if (OLLAMA_URL) {
    try {
      const res = await fetch(OLLAMA_URL + "/api/tags");
      if (res.ok) {
        const data = await res.json();
        ollamaModels = data.models || [];
      }
    } catch {
      // Ollama not available, continue with cloud models only
    }
  }

  const allModels = [
    ...minimaxModels.map((name) => ({ name })),
    ...ollamaModels,
  ];

  return Response.json({ models: allModels });
}
