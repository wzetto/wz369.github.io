# Gitalk 1.8.0

Vendored from the official npm release at https://unpkg.com/gitalk@1.8.0/.
The MIT license is included.

Changes to `dist/gitalk.min.js`:

- Remove the three Basic-auth configurations on public issue/comment reads.
- Remove `client_secret` from the OAuth request; the Worker supplies it.
- Remove the source-map reference (the upstream map is not shipped).

All UI, issue labels, page IDs, signed-in requests, and comment creation behavior
are otherwise unchanged. Anonymous reads use GitHub's unauthenticated rate limit.

Upstream minified JavaScript SHA-256: `3152bd3060ff5c9686c88821495ace3529e85e81a1dc81712f0d337efce9c51e`.

When upgrading, reapply these changes and verify public comment reads and login.
Do not restore browser-side credentials or the default third-party OAuth proxy.
