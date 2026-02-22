export async function onRequest(context) {
  const { DB } = context.env;

  const result = await DB
    .prepare("SELECT name FROM sqlite_master WHERE type='table';")
    .all();

  return new Response(JSON.stringify(result.results), {
    headers: { "Content-Type": "application/json" }
  });
}
