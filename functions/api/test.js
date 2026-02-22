export async function onRequest(context) {
  const { DB } = context.env;

  const result = await DB
    .prepare("PRAGMA table_info(users);")
    .all();

  return new Response(
    JSON.stringify(result.results),
    { headers: { "Content-Type": "application/json" } }
  );
}
