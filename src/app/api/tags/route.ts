export async function GET() {
  const res = await fetch(process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags");
  return new Response(res.body, res);
}
