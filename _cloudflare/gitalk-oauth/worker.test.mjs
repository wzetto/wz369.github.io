import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.mjs";

const origin = "https://wzetto.github.io";
const endpoint = "https://comments.ereshkigal.ai/oauth/access_token";
const payload = { code: "test-authorization-code", client_id: "7b560b97e4bda87153dd" };
const env = { GITHUB_CLIENT_SECRET: "test-only-server-secret" };
function request(body = payload, headers = {}) {
  return new Request(endpoint, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("rejects untrusted requests before contacting GitHub", async () => {
  const saved = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("Unexpected upstream request"); };
  try {
    for (const headers of [{ Origin: "https://evil.example" }, { Origin: "null" }]) {
      const response = await worker.fetch(request(payload, headers), env);
      assert.equal(response.status, 403);
      assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
    }
    for (const body of ["invalid-json", "null", "x".repeat(2049),
      { ...payload, client_id: "other-app" }, { ...payload, code: "" },
      { ...payload, client_secret: "browser-secret" }, { ...payload, url: "https://evil.example" }]) {
      assert.equal((await worker.fetch(request(body), env)).status, 400);
    }
    assert.equal((await worker.fetch(request(payload, { "Content-Type": "text/plain" }), env)).status, 415);
    assert.equal((await worker.fetch(request(), {})).status, 503);
    assert.equal((await worker.fetch(new Request(endpoint, { headers: { Origin: origin } }), env)).status, 405);
    assert.equal((await worker.fetch(new Request(endpoint + "?code=leak"), env)).status, 404);
  } finally { globalThis.fetch = saved; }
});

test("CORS permits only the configured site's POST requests", async () => {
  const response = await worker.fetch(new Request(endpoint, {
    method: "OPTIONS",
    headers: { Origin: origin, "Access-Control-Request-Method": "POST" },
  }), env);
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(response.headers.get("Access-Control-Allow-Methods"), "POST");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("exchanges the code using only the server secret and returns a minimal response", async () => {
  const saved = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://github.com/login/oauth/access_token");
    assert.equal(options.redirect, "manual");
    assert.deepEqual(JSON.parse(options.body), { ...payload, client_secret: env.GITHUB_CLIENT_SECRET });
    return Response.json({ access_token: "test-token", token_type: "bearer", scope: "public_repo", secret: env.GITHUB_CLIENT_SECRET });
  };
  try {
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await response.json(), { access_token: "test-token", token_type: "bearer", scope: "public_repo" });
  } finally { globalThis.fetch = saved; }
});

test("upstream failures cannot reflect credentials to the browser", async () => {
  const saved = globalThis.fetch;
  try {
    for (const upstream of [
      Response.json({ error: "bad_code", detail: env.GITHUB_CLIENT_SECRET }),
      new Response(env.GITHUB_CLIENT_SECRET, { status: 500 }),
      new Response(null, { status: 302, headers: { Location: "https://evil.example" } }),
    ]) {
      globalThis.fetch = async () => upstream;
      const response = await worker.fetch(request(), env);
      assert.ok(response.status >= 400);
      assert.equal((await response.text()).includes(env.GITHUB_CLIENT_SECRET), false);
    }
  } finally { globalThis.fetch = saved; }
});
