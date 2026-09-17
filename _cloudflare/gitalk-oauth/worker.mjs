const CLIENT_ID = "7b560b97e4bda87153dd";
const ORIGINS = new Set([
  "https://wzetto.github.io",
  "https://ereshkigal.ai",
  "https://www.ereshkigal.ai",
]);
const MAX_BODY_BYTES = 2048;

async function readBody(request) {
  if (!request.body) throw new Error("empty_body");
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("body_too_large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Vary": "Origin",
    };
    const reply = (status, body) => new Response(JSON.stringify(body), { status, headers });
    if (url.protocol !== "https:") return reply(400, { error: "https_required" });
    if (url.pathname !== "/oauth/access_token" || url.search) return reply(404, { error: "not_found" });
    if (!ORIGINS.has(origin)) return reply(403, { error: "origin_not_allowed" });
    headers["Access-Control-Allow-Origin"] = origin;
    if (request.method === "OPTIONS") {
      if (request.headers.get("Access-Control-Request-Method") !== "POST") {
        return reply(405, { error: "method_not_allowed" });
      }
      headers["Access-Control-Allow-Methods"] = "POST";
      headers["Access-Control-Allow-Headers"] = "Content-Type";
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") return reply(405, { error: "method_not_allowed" });
    if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return reply(415, { error: "json_required" });
    }
    let body;
    try {
      body = await readBody(request);
    } catch {
      return reply(400, { error: "invalid_request" });
    }
    if (!body || body.client_id !== CLIENT_ID || typeof body.code !== "string" ||
        !/^[a-zA-Z0-9_-]{1,256}$/.test(body.code) ||
        Object.keys(body).some(key => !["code", "client_id"].includes(key))) {
      return reply(400, { error: "invalid_request" });
    }
    if (!env.GITHUB_CLIENT_SECRET) return reply(503, { error: "oauth_not_configured" });
    let stage = "upstream_request";
    try {
      // Fixed destination and app ID: this is not a general-purpose proxy.
      // Never log the request, authorization code, secret, or returned token.
      const upstream = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        redirect: "manual",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "wzetto-gitalk-oauth",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: body.code,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!upstream.ok) {
        console.error(JSON.stringify({ message: "GitHub OAuth HTTP error", status: upstream.status }));
        return reply(502, { error: "oauth_unavailable" });
      }
      stage = "upstream_json";
      const result = await upstream.json();
      if (typeof result.access_token !== "string" || !result.access_token) {
        return reply(400, { error: "oauth_exchange_failed" });
      }
      // Only return the fields Gitalk needs, never arbitrary upstream fields.
      return reply(200, {
        access_token: result.access_token,
        token_type: result.token_type,
        scope: result.scope,
      });
    } catch (error) {
      console.error(JSON.stringify({
        message: "Gitalk OAuth exchange unavailable",
        stage,
        error_type: error instanceof SyntaxError ? "invalid_json" :
          error instanceof TypeError ? "request_error" : "upstream_failure",
      }));
      return reply(502, { error: "oauth_unavailable" });
    }
  },
};
