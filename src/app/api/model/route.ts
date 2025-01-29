// app/api/model/route.ts
export async function POST(req: Request) {
  const { name } = await req.json();

  const ollamaUrl = process.env.OLLAMA_URL;

  const response = await fetch(ollamaUrl + "/api/pull", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to pull model");
  }

  const contentLength = response.headers.get("content-length");
  const totalBytes = contentLength ? parseInt(contentLength, 10) : null;

  const stream = createProgressStream(response.body, totalBytes);

  const headers = new Headers(response.headers);
  headers.set("Content-Type", "application/json");
  return new Response(stream, { headers });
}

function createProgressStream(
  body: ReadableStream<Uint8Array> | null,
  totalBytes: number | null
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      const reader = body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          const progressMessage = JSON.stringify({ progress: 100 });
          controller.enqueue(new TextEncoder().encode(progressMessage + "\n"));
          controller.close();
          return;
        }

        receivedBytes += value.length;
        const progress = totalBytes ? (receivedBytes / totalBytes) * 100 : null;

        const progressMessage = JSON.stringify({ progress });
        controller.enqueue(new TextEncoder().encode(progressMessage + "\n"));

        controller.enqueue(value);
      }
    },
  });
}