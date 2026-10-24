// Serves the published Gaussian-splat model files in R2 to the GitHub Pages viewers.
// The RAD viewer streams pages and rejects anything except exact 206 range responses.
const ORIGINS = new Set([
  "https://wzetto.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://127.0.0.1:8765",
]);
// 3dgs/<scene>/<version>/<file>; files are versioned, so responses are immutable.
const KEY = /^\/(3dgs\/[a-z0-9][a-z0-9_-]*\/[a-z0-9][a-z0-9_-]*\/[a-z0-9][a-z0-9_-]*\.(rad|spz|jpg|png))$/;
const TYPES = { rad: "application/octet-stream", spz: "application/octet-stream", jpg: "image/jpeg", png: "image/png" };

// Single byte range only: "bytes=a-b", "bytes=a-" or "bytes=-n". Returns null if unsupported.
function parseRange(value) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (match[1] === "" && match[2] === "")) return null;
  const [start, end] = [match[1], match[2]].map(part => part === "" ? undefined : Number(part));
  if ([start, end].some(n => n !== undefined && !Number.isSafeInteger(n))) return null;
  if (start === undefined) return end > 0 ? { suffix: end } : null;
  if (end !== undefined && end < start) return null;
  return { start, end };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const headers = new Headers({ "X-Content-Type-Options": "nosniff", Vary: "Origin" });
    if (ORIGINS.has(origin)) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges, ETag");
    }
    const reply = (status, body = null) => {
      if (body !== null) headers.set("Content-Type", "text/plain; charset=utf-8");
      return new Response(request.method === "HEAD" ? null : body, { status, headers });
    };

    const match = KEY.exec(url.pathname);
    if (!match || url.search) return reply(404, "Not found");
    if (request.method === "OPTIONS") {
      if (!ORIGINS.has(origin)) return reply(403, "Origin not allowed");
      headers.set("Access-Control-Allow-Methods", "GET, HEAD");
      headers.set("Access-Control-Allow-Headers", "Range");
      headers.set("Access-Control-Max-Age", "3600");
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers.set("Allow", "GET, HEAD, OPTIONS");
      return reply(405, "Method not allowed");
    }

    const [, key, ext] = match;
    headers.set("Content-Type", TYPES[ext]);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Accept-Ranges", "bytes");

    const rangeHeader = request.headers.get("Range");
    if (request.method === "HEAD" || rangeHeader === null) {
      const object = request.method === "HEAD" ? await env.MODELS.head(key)
        : await env.MODELS.get(key, { onlyIf: request.headers });
      if (!object) return reply(404, "Not found");
      headers.set("ETag", object.httpEtag);
      if (request.method === "GET" && !("body" in object)) {
        return reply(request.headers.has("If-None-Match") ? 304 : 412);
      }
      headers.set("Content-Length", String(object.size));
      return new Response(request.method === "HEAD" ? null : object.body, { status: 200, headers });
    }

    const range = parseRange(rangeHeader);
    const meta = await env.MODELS.head(key);
    if (!meta) return reply(404, "Not found");
    headers.set("ETag", meta.httpEtag);
    const size = meta.size;
    let start, end;
    if (range?.suffix !== undefined) [start, end] = [Math.max(size - range.suffix, 0), size - 1];
    else if (range) [start, end] = [range.start, Math.min(range.end ?? size - 1, size - 1)];
    if (!range || size === 0 || start >= size) {
      headers.set("Content-Range", `bytes */${size}`);
      return reply(416, "Range not satisfiable");
    }
    const length = end - start + 1;
    const object = await env.MODELS.get(key, { range: { offset: start, length } });
    if (!object) return reply(404, "Not found");
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(length));
    return new Response(object.body, { status: 206, headers });
  },
};
