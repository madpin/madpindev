# MadPinDev Personal Blog

A multilingual static blog built with Hugo. The site uses local semantic templates, Hugo image processing, Pagefind search, and Cloudflare Pages Git deployment.

## Architecture

```text
content page bundles
  -> Hugo 0.164.0 Extended
  -> local templates and fingerprinted assets
  -> responsive WebP images, HTML, RSS, sitemap, and robots.txt
  -> Pagefind English and Portuguese indexes
  -> dist/
  -> Cloudflare Pages Git deployment
```

The site has no application server, database, analytics, advertising scripts, or third-party browser dependencies.

## Requirements

- Docker 29 or compatible
- Node.js 20.19.0
- npm
- make
- Git

Hugo is pinned in `.hugo-version`. The Makefile uses a versioned, digest-pinned Hugo Extended container, so a local Hugo installation is optional for the normal workflow.

## Setup

```bash
git clone git@github.com:madpin/madpindev.git
cd madpindev
npm ci
make dev
```

The development server is available at `http://localhost:1313` and binds only to the local machine. Drafts are included by default.

To preview without drafts:

```bash
make production-server
```

## Content

Posts are Hugo leaf bundles:

```text
content/post/example-post/
├── index.en.md
├── index.pt-br.md
└── cover.jpg
```

The Portuguese file is optional. Matching language files should use the same `translationKey` when they are translations of each other.

Create a new English post bundle with:

```bash
make new SLUG=example-post
```

Then add `cover.jpg`, complete the generated front matter, and write the article. Publish it with:

```bash
make publish POST=example-post
```

Existing URLs are preserved through Hugo aliases and `static/_redirects`. New post URLs follow `/YYYY/MM/DD-slug/`; Portuguese URLs are under `/pt-br/`.

## Build and verification

Build the production artifact using the pinned Docker image:

```bash
make build
```

The result is written to `dist/`. The build also creates the Pagefind indexes.

Run the complete release gate:

```bash
make verify
```

Verification includes:

- required front matter and page-bundle image checks
- a warning-free production build
- a separate draft and future-content build
- internal link and fragment validation
- canonical, social metadata, RSS, crawler, redirect, header, and artifact-size checks
- generated HTML validation
- npm dependency audit in CI
- Chromium desktop and mobile tests
- axe WCAG 2 A/AA checks
- English and Portuguese Pagefind tests
- ADHD and ACLS interaction tests

Developers with Hugo 0.164.0 Extended installed locally can run the equivalent npm gate:

```bash
npm test
```

## Search

Pagefind runs locally after Hugo builds the site. It detects `<html lang>` and creates independent English and Portuguese indexes. Search queries stay in the browser and are not sent to a hosted search provider.

For a production-style local search preview:

```bash
npm run build
npx pagefind --site dist --serve
```

## Deployment

Cloudflare Pages deploys the `main` branch through its Git integration. Configure the project with:

- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`

Cloudflare installs dependencies automatically with `npm clean-install`; the committed `.npmrc` and lockfile resolve all packages through the public npm registry.
- `NODE_VERSION`: `20.19.0`
- `HUGO_VERSION`: `0.164.0`

Pull requests are verified by `.github/workflows/ci.yml`. Cloudflare should deploy only after the required CI check succeeds.

`static/_headers` defines browser security and cache headers. `static/_redirects` preserves migrated URLs. Configure `www.madpin.dev` as a Cloudflare domain redirect to `https://madpin.dev` because Pages path redirects cannot implement domain-level redirects.

## Privacy and security

Google Analytics and Algolia have been removed. The ADHD task keeps session data in memory unless the visitor downloads it. ACLS personal notes use browser-local storage and never leave the device.

Repository content is trusted build input. Raw Markdown HTML is disabled. Runtime scripts and styles are local, minified, fingerprinted, and protected by the deployed Content Security Policy.

## License

No license is granted for the site source or content unless a file explicitly states otherwise.
