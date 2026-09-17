Personal website.

## Build

GitHub Pages builds the Jekyll sources from the `gh-pages` branch root. `_site/`
is generated output, not a publishing source; do not commit it.

```sh
bundle exec jekyll serve
```

`omoi_main/ssg`, `notes`, and `backup` are excluded from site generation.

## Comments

Gitalk keeps existing comment threads and uses a Cloudflare endpoint for OAuth.
See [_cloudflare/gitalk-oauth/README.md](_cloudflare/gitalk-oauth/README.md) for
deployment and the required rotation of the previously exposed client secret.
