# Gitalk OAuth endpoint

`https://comments.ereshkigal.ai/oauth/access_token` keeps the GitHub OAuth client
secret on Cloudflare. The site's existing Gitalk interface, issue labels and
comment repository (`wzetto/gitalk-cobuffer`) are preserved.

The browser sends only an authorization code and the public client ID. The Worker
accepts JSON POSTs from the three production site origins, enforces a 2 KiB body
limit, uses a fixed GitHub destination and app ID, and never logs credentials or
returns arbitrary upstream fields. OAuth responses use `Cache-Control: no-store`.
The endpoint is not a general-purpose proxy. Origin checks constrain browser use;
they do not authenticate non-browser clients. GitHub validates the one-use code.

## Secret rotation and release order

The exposed secret also exists in old commits. Removing it from current files
does not revoke it. Complete rotation in this order to avoid disrupting login:

1. Deploy this Worker with a `GITHUB_CLIENT_SECRET` **secret binding**. Never put
   its value in this repository, a frontend environment variable, or build output.
2. Publish the updated Jekyll sources; check that pages use this endpoint and the
   vendored Gitalk script. GitHub Pages builds from the `gh-pages` branch root;
   `_site` is disposable local output and must stay untracked.
3. In https://github.com/settings/applications/1984131 generate a new client secret.
4. In Cloudflare > Workers & Pages > `gitalk-oauth` > Settings > Variables and
   Secrets, set `GITHUB_CLIENT_SECRET` to the new value with type **Secret**, then
   deploy the change. Do not paste the value into chat or source files.
5. Check GitHub sign-in on a published article, then delete the old secret in the
   GitHub OAuth app settings. Keep the client ID and redirect URI unchanged.

The initial deployment uses the existing secret for continuity until steps 3–5
are completed. It must still be treated as compromised until revoked. History
cleanup alone cannot invalidate copies already fetched by other people.

The OAuth app currently redirects to `https://wzetto.github.io/wz369.github.io/`.
Local previews can display public comments, but GitHub login should be tested on
the published site. The new endpoint does not add localhost callback access.

## Maintenance

- Worker configuration: `wrangler.jsonc`; the initial deployment uses Cloudflare's
  multipart upload API, preserving the secret binding on later code uploads.
- Tests: `node --test _cloudflare/gitalk-oauth/worker.test.mjs` from the repo root.
- Gitalk 1.8.0 and the minimal frontend changes are documented in
  `assets/vendor/gitalk/README.md`.
- Public issue/comment reads are anonymous and subject to GitHub's anonymous API
  rate limit. Signed-in comment posting still uses the visitor's GitHub token.

References: [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/),
[GitHub leaked credential guidance](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
