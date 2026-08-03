# AGENT.md

Working notes for AI agents on this repository. This file covers the **machine-enforced contracts** and house idioms — the things that fail `make verify` or that you would otherwise guess wrong.

For setup, architecture, and deployment see `README.md`. For the full make target list see `MAKEFILE_DOCS.md` or run `make help`.

## What this is

Hugo 0.164.0 Extended static blog, English + Brazilian Portuguese, Pagefind search, deployed by Cloudflare Pages from `main`. No application server, no database, no analytics, no third-party browser scripts.

The workflow is Docker-backed: the Makefile runs a version- and digest-pinned Hugo image, so a local `hugo` binary is optional.

## Commands

| Command | Purpose |
|---|---|
| `make dev` | Development server with drafts on `127.0.0.1:1313` |
| `make new SLUG=my-post` | New English bundle from `archetypes/post.md` |
| `make publish POST=my-post` | Flip the English bundle to `draft: false` |
| `make build` | Production build into `dist/` plus Pagefind indexes |
| `make verify` | The full release gate — run this before declaring done |

> **`make build` and `npm run build` are not equivalent.**
> The Makefile build (`Makefile:123-134`) passes `--panicOnWarning`; the npm script (`package.json:10`) does not. CI runs `make verify`, so **any Hugo warning is a hard CI failure** even though Cloudflare Pages builds fine with the permissive npm script. Always verify with `make verify`.

`make verify` runs in this order (`Makefile:147-153`), each step gating the next:

```text
npm run check:content   ->  make build  ->  npm run check:output
  ->  npm run check:html  ->  npm run test:e2e  ->  make draft
```

## Content contract — `scripts/check-content.mjs`

Enforced only over `content/post/**/index*.md`. Other sections (`content/about`, `content/pages`, `content/adhd-assessment`) are **not** covered by this check.

- Eleven required front-matter fields: `type`, `title`, `description`, `date`, `lastmod`, `draft`, `author`, `image`, `imageAlt`, `categories`, `tags`
- `type: post`, and `draft:` explicitly `true` or `false` — not omitted, not implied
- No `URL:` field — URLs come from central permalinks (`hugo.yml:29-32`) and `aliases`
- No empty list items (a `-` with nothing after it)
- `description` must be meaningful prose, not an image path
- `image` resolves differently by form: a relative path is looked up in the page bundle then `assets/`; a leading-slash path is looked up in `static/` **only**; `http(s)` URLs are accepted as-is
- Body headings start at **H2** — `#` is reserved for the title
- No raw `<script>`, `<style>`, `<link>`, `<iframe>`, or `<div>` in post bodies
- No literal "placeholder" text

The last three rules skip fenced code blocks, so a post can document HTML inside a fence.

Posts are leaf bundles. The Portuguese file is optional; when both exist they must share a `translationKey`:

```text
content/post/my-post/
├── index.en.md
├── index.pt-br.md      # optional
└── cover.jpg           # referenced as image: cover.jpg
```

See `content/post/japan-2026-destination-menu/` for a complete current example.

### Optional front matter

`archetypes/post.md` emits only the required fields, so `make new` will not hint at these:

| Field | Effect |
|---|---|
| `showtoc: true` | Renders the table of contents **and** the wide-view control (`layouts/post/single.html:3,13`). Omitted means no TOC, with nothing to explain why. |
| `translationKey` | Links EN and pt-BR versions. Required whenever both exist. |
| `subtitle` | Deck line in the hero (`layouts/_partials/hero.html:20`) and on the post card (`layouts/_partials/post-card.html:4`). Common across existing posts. |
| `slug` | Overrides the URL segment in the permalink. |
| `unlisted: true` | Neighbouring posts drop their prev/next link to this one (`layouts/post/single.html:21-22`). |
| `noindex: true` | Emits `robots: noindex,follow` (`layouts/_partials/head.html:19`). |
| `hideHero: true` | Suppresses the hero partial (`layouts/baseof.html:10`). |
| `build: {publishResources: false}` | Skips copying unused bundle resources into `dist/` — useful for image-heavy bundles. |

**Raw HTML in Markdown is silently dropped.** `markup.goldmark.renderer.unsafe: false` (`hugo.yml:73-75`) — it does not error, it just disappears. Use a render hook or a layout instead.

## Output contract — `scripts/check-output.mjs`

Runs against the built `dist/`:

- No single file over 800 KB
- No development URLs or livereload; no third-party CDN or analytics strings
- `<html lang>` must be `en-US` or `pt-BR`; `<main id="main-content">` must be present
- Canonical must be absolute (`https://madpin.dev/…`); `og:image` must be absolute
- No empty `href` or `src`
- **Every internal link and `#fragment` must resolve.** Changing a URL therefore requires a 301 in `static/_redirects` and fixing every inbound link.
- Required artifacts: `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `index.xml`, `pagefind/pagefind.js`
- `_headers` must keep `Content-Security-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`
- Utility pages (`/search/`, `/archive/`, `/about/`, ADHD, ACLS) must not leak into RSS

## Never emit inline styles

`static/_headers:2` sets `style-src 'self'` and `.htmlvalidate.json:10` sets `no-inline-style: error`. A `style="…"` attribute breaks both. Express everything as CSS classes — the rationale is already written down in the header comment of `layouts/_markup/render-table.html`:

> Expresses column alignment as CSS classes, never inline styles, to satisfy the site's Content-Security-Policy and html-validate no-inline-style rule.

`script-src` does allow `'unsafe-inline'`, but only for the pre-paint theme bootstrap in `layouts/_partials/head.html:14`. Do not add more inline scripts.

## Templates and assets

- **Layout paths are Hugo 0.146+ style**: `layouts/baseof.html`, `layouts/page.html`, `layouts/_partials/`, `layouts/_markup/`. Do **not** create `layouts/_default/`. The vendored theme still uses the legacy path — that is expected, not a bug to fix.
- **Asset pipeline** is always `resources.Get … | minify | fingerprint` with an `integrity` attribute — see `layouts/_partials/head.html:43-48` and `layouts/baseof.html:15-17`.
- **Page-scoped assets** go in `{{ define "page_styles" }}` / `{{ define "page_scripts" }}` blocks, not in the shared bundle. See `layouts/tools/adhd.html:1-4`.
- **Tool pages select their layout from front matter**: `type: tools` + `layout: adhd|acls` + `hideHero: true` resolves `layouts/tools/<layout>.html`. See `content/adhd-assessment/index.md`.
- **Render hooks**: `layouts/_markup/render-image.html` emits responsive WebP (480/800/1280) inside a `<figure>`; `layouts/_markup/render-table.html` adds the scroll wrapper and gallery/long-table detection.
- **The theme is vendored, not a submodule.** `themes/hugo-admonitions/` is checked into the tree (there is no `.gitmodules`) and already carries local modifications. Editing it is editing vendored code — say so in the commit message.

## i18n is dual-file

Shared chrome — `nav`, `footer`, `pagination`, `sidebar`, `post/single.html`, and the other top-level layouts — puts every user-visible string through `{{ i18n "key" }}`, and each key must exist in **both** `i18n/en.yaml` and `i18n/pt-br.yaml`. Adding one string is a three-file change: both YAML files plus the layout.

The exception is the single-language tool pages under `layouts/tools/` (`adhd.html`, `acls.html`). They hardcode their English copy, use no `i18n` calls, and are not translated. Leave them that way unless you are deliberately localising them.

## Tests — `tests/site.spec.mjs`

- Playwright serves the built `dist/` through `npx pagefind --site dist --serve` on `127.0.0.1:1414` (`playwright.config.mjs:17-21`). **`dist/` must be freshly built first** — that is why `verify` orders the build before `test:e2e`.
- Two projects: Desktop Chrome and Pixel 5. axe WCAG 2 A/AA runs in **both** light and dark themes.
- Some assertions are coupled to real content: the English Pagefind test expects a result matching `/python/i`, the Portuguese test expects a `/pt-br/` result, and the hero test expects a WebP `srcset` with `fetchpriority="high"`. Renaming or deleting posts can break tests that look unrelated.

## Generated — do not edit

`dist/`, `.tmp/`, `public/`, `resources/_gen/`, `node_modules/` are all build output and gitignored.

Toolchain versions are pinned in `.hugo-version` (0.164.0), `.node-version` (20.19.0), and the digest-pinned image at `Makefile:29`. Changing any of them is an intentional toolchain change, not a routine edit.

## Definition of done

`make verify` passes.

If Docker is unavailable, `npm test` is the closest local equivalent, but it skips `--panicOnWarning` — treat it as a weaker check, not a substitute for the gate CI runs.
