export async function onRequest(context) {
  const { DB } = context.env;

  const result = await DB
    .prepare("SELECT * FROM users;")
    .all();

  return new Response(JSON.stringify(result.results), {
    headers: { "Content-Type": "application/json" }
  });
}
