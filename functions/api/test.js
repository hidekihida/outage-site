export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  if (request.method === "POST") {
    const data = await request.json();

    await DB.prepare(
      "INSERT INTO users (name) VALUES (?);"
    ).bind(data.name).run();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const result = await DB.prepare("SELECT * FROM users;").all();

  return new Response(
    JSON.stringify(result.results),
    { headers: { "Content-Type": "application/json" } }
  );
}
