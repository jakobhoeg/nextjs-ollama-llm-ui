export async function GET(req: Request) {
  const res = await fetch(
    process.env.OLLAMA_URL + "/api/tags"
  );
  return new Response(res.body, res);
}
