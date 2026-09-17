const HOMEPAGE = "https://wzetto.github.io/wz369.github.io/";
const INDEX_PATHS = new Set(["/", "/index", "/index.html", "/index.md"]);

class GitHubLinks {
  element(element) {
    for (const attribute of ["href", "src", "poster", "data-gifffer"]) {
      const value = element.getAttribute(attribute);
      if (value && !value.startsWith("#")) {
        element.setAttribute(attribute, new URL(value, HOMEPAGE).href);
      }
    }
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.href, 301);
    }

    // Only the index is mirrored. Direct article/asset visits open GitHub Pages.
    if (!INDEX_PATHS.has(url.pathname)) {
      const target = new URL(HOMEPAGE);
      target.pathname = url.pathname.startsWith(target.pathname)
        ? url.pathname
        : target.pathname + url.pathname.replace(/^\/+/, "");
      target.search = url.search;
      return Response.redirect(target.href, 302);
    }

    try {
      // Fetch the public, Jekyll-rendered index without forwarding visitor data.
      const upstream = await fetch(HOMEPAGE, {
        headers: { Accept: "text/html" },
        cf: { cacheEverything: true, cacheTtlByStatus: { "200-299": 60, "300-599": -1 } },
      });
      if (!upstream.ok || !upstream.headers.get("content-type")?.includes("text/html")) {
        if (upstream.body) await upstream.body.cancel();
        throw new Error(`GitHub homepage returned ${upstream.status}`);
      }

      const headers = new Headers({
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60",
        "X-Content-Type-Options": "nosniff",
      });
      if (request.method === "HEAD") {
        if (upstream.body) await upstream.body.cancel();
        return new Response(null, { headers });
      }

      return new HTMLRewriter()
        .on("head", {
          element(element) {
            element.prepend(`<base href="${HOMEPAGE}">`, { html: true });
          },
        })
        .on("[href], [src], [poster], [data-gifffer]", new GitHubLinks())
        .transform(new Response(upstream.body, { headers }));
    } catch (error) {
      console.error(JSON.stringify({ message: "Homepage fetch failed", error: String(error) }));
      return new Response(request.method === "HEAD" ? null :
        `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Homepage temporarily unavailable</title><p>The homepage is temporarily unavailable. <a href="${HOMEPAGE}">Open it on GitHub Pages</a>.</p></html>`, {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Retry-After": "60" },
      });
    }
  },
};
