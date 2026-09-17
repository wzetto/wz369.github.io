# ereshkigal.ai homepage

This Cloudflare Worker displays the published GitHub Pages homepage at
https://ereshkigal.ai/ and https://www.ereshkigal.ai/ while keeping article links
and assets on GitHub Pages. Both hostnames use the same Worker and display the
homepage directly.
The source content remains the repository's root `index.md` and its Jekyll layout.

`/`, `/index`, `/index.html`, and `/index.md` serve the same rendered homepage.
Other paths redirect to the corresponding path under
https://wzetto.github.io/wz369.github.io/ (including the query string).
HTTP requests first redirect to HTTPS on the requested hostname.

The Worker fetches the published homepage with a 60-second Cloudflare cache and
sets a 60-second browser cache. After publishing changes to GitHub Pages, they
appear here automatically after the GitHub and Cloudflare caches refresh. No
separate copy of the Markdown or build automation is needed. GitHub and the
homepage's existing external image/script providers remain runtime dependencies.

`worker.mjs` is a standalone ES module with no packages or secrets. The initial
deployment uses the Cloudflare API's Worker multipart upload, with `worker.mjs`
as `main_module`, the compatibility date and observability settings from
`wrangler.jsonc`, and a custom domain attached to `ereshkigal-homepage`.
The underscore-prefixed directory keeps this infrastructure out of Jekyll output.

Cloudflare zone: `f07cef98c3963a00b8910429c522a83d`.
The `assets.ereshkigal.ai` R2 custom domain is independent of this Worker.

References: [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/),
[custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/),
[multipart upload](https://developers.cloudflare.com/workers/configuration/multipart-upload-metadata/).
