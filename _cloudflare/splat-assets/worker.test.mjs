import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.mjs";

const origin = "https://wzetto.github.io";
const base = "https://splat-assets.example.workers.dev";
const key = "3dgs/scene01/v2/full-lod.rad";
const data = new Uint8Array(100).map((_, i) => i);

// Minimal stand-in for the R2 binding methods the Worker uses.
const env = {
  MODELS: {
    async head(k) { return k === key ? { size: data.length, httpEtag: '"etag"' } : null; },
    async get(k, { range, onlyIf } = {}) {
      if (k !== key) return null;
      const meta = { size: data.length, httpEtag: '"etag"' };
      if (onlyIf?.get?.("If-None-Match") === '"etag"') return meta;
      const bytes = range ? data.slice(range.offset, range.offset + range.length) : data;
      return { ...meta, body: new Response(bytes).body };
    },
  },
};
const fetchAsset = (path, init = {}) => worker.fetch(new Request(base + path, init), env);

test("serves exact byte ranges the RAD viewer accepts", async () => {
  const response = await fetchAsset(`/${key}`, { headers: { Origin: origin, Range: "bytes=0-31" } });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), "bytes 0-31/100");
  assert.equal(response.headers.get("Content-Length"), "32");
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.match(response.headers.get("Access-Control-Expose-Headers"), /Content-Range/);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), data.slice(0, 32));

  const clamped = await fetchAsset(`/${key}`, { headers: { Range: "bytes=90-199" } });
  assert.equal(clamped.headers.get("Content-Range"), "bytes 90-99/100");
  assert.equal((await clamped.arrayBuffer()).byteLength, 10);
  const suffix = await fetchAsset(`/${key}`, { headers: { Range: "bytes=-5" } });
  assert.equal(suffix.headers.get("Content-Range"), "bytes 95-99/100");

  for (const value of ["bytes=100-", "bytes=5-1", "bytes=0-1,4-5", "items=0-1"]) {
    const invalid = await fetchAsset(`/${key}`, { headers: { Range: value } });
    assert.equal(invalid.status, 416, value);
    assert.equal(invalid.headers.get("Content-Range"), "bytes */100");
  }
});

test("serves full files, HEAD and conditional requests", async () => {
  const full = await fetchAsset(`/${key}`);
  assert.equal(full.status, 200);
  assert.equal(full.headers.get("Content-Length"), "100");
  assert.equal(full.headers.get("Cache-Control"), "public, max-age=31536000, immutable");
  assert.equal((await full.arrayBuffer()).byteLength, 100);
  const head = await fetchAsset(`/${key}`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("Content-Length"), "100");
  assert.equal(head.body, null);
  assert.equal((await fetchAsset(`/${key}`, { headers: { "If-None-Match": '"etag"' } })).status, 304);
});

test("rejects other paths, methods, queries and origins", async () => {
  for (const path of ["/", "/space/page/index.html", "/3dgs/scene01/v2/missing.rad",
    "/3dgs/scene01/v2/../v1/full.rad", "/3dgs/scene01/full.rad", "/3dgs/scene01/v2/notes.txt"]) {
    assert.equal((await fetchAsset(path)).status, 404, path);
  }
  assert.equal((await fetchAsset(`/${key}?v=1`)).status, 404);
  assert.equal((await fetchAsset(`/${key}`, { method: "POST", body: "x" })).status, 405);
  const preflight = { method: "OPTIONS", headers: { "Access-Control-Request-Method": "GET" } };
  const allowed = await fetchAsset(`/${key}`, { ...preflight, headers: { ...preflight.headers, Origin: origin } });
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers.get("Access-Control-Allow-Headers"), "Range");
  const denied = await fetchAsset(`/${key}`, { ...preflight, headers: { ...preflight.headers, Origin: "https://evil.example" } });
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
});
