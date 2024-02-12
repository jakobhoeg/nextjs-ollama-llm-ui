export async function POST(req: Request) {
    const { name } = await req.json();
    
    const response = await fetch(process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/pull", {
        method: "POST",
        body: JSON.stringify({ name }),
    });

    // Create a new ReadableStream from the response body
    const stream = new ReadableStream({
        start(controller) {
            if (!response.body) {
                controller.close();
                return;
            }
            const reader = response.body.getReader();

            function pump() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        controller.close();
                        return;
                    }
                    // Enqueue the chunk of data to the controller
                    controller.enqueue(value);
                    pump();
                }).catch(error => {
                    console.error("Error reading response body:", error);
                    controller.error(error);
                });
            }

            pump();
        }
    });

    // Set response headers and return the stream
    const headers = new Headers(response.headers);
    headers.set("Content-Type", "application/json");
    return new Response(stream, { headers });
}
