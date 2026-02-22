export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  // GET: lista usuários
  if (request.method === "GET") {
    const result = await DB.prepare(
      "SELECT id, username, display_name, is_member, last_login_at FROM users ORDER BY last_login_at DESC LIMIT 50;"
    ).all();

    return new Response(JSON.stringify(result.results), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST: cria/atualiza usuário
  if (request.method === "POST") {
    const body = await request.json();

    // valores mínimos (faz fallback pra não quebrar)
    const id = body.id ?? crypto.randomUUID();
    const username = body.username ?? null;
    const display_name = body.display_name ?? null;
    const is_member = body.is_member ?? 0;
    const last_login_at = body.last_login_at ?? new Date().toISOString();

    await DB.prepare(
      `INSERT INTO users (id, username, display_name, is_member, last_login_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         username = excluded.username,
         display_name = excluded.display_name,
         is_member = excluded.is_member,
         last_login_at = excluded.last_login_at;`
    )
      .bind(id, username, display_name, is_member, last_login_at)
      .run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
