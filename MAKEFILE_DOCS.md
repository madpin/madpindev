# Makefile Reference

The Makefile provides the Docker-backed workflow for the Hugo blog. Run `make help` for the current target list.

## Development

| Target | Purpose |
|---|---|
| `make dev` | Start the local server with drafts on `127.0.0.1:1313` |
| `make production-server` | Start the local server without drafts |
| `make stop` | Stop the named development container |
| `make logs` | Follow development container logs |
| `make shell` | Open a shell in the running container |

Override the local port with `make dev HOST_PORT=8080`.

## Content

| Target | Purpose |
|---|---|
| `make new SLUG=my-post` | Create `content/post/my-post/index.en.md` from the project archetype |
| `make publish POST=my-post` | Change the English bundle draft flag to `false` |
| `make list-posts` | List published content through Hugo |
| `make list-drafts` | List draft content through Hugo |
| `make stats` | Print Hugo's resolved content inventory |
| `make check-images` | Run the content and bundle contract check |

Slugs must contain lowercase letters, numbers, and single hyphens.

## Build and verification

| Target | Purpose |
|---|---|
| `make build` | Build production into `dist/` and create Pagefind indexes |
| `make draft` | Build drafts and future content into `.tmp/drafts/` |
| `make verify` | Run the complete Docker-backed release gate |
| `make test` | Alias for `make verify` |
| `make search` | Rebuild Pagefind for the existing `dist/` artifact |
| `make search-setup` | Install exact Node dependencies with `npm ci` |
| `make clean` | Remove generated project artifacts |
| `make clean-cache` | Remove the guarded Hugo cache path |

The Hugo image is pinned by version and OCI digest. Override variables only when intentionally testing a toolchain change:

```bash
make build HUGO_VERSION=0.164.0 HUGO_IMAGE=repository/image@sha256:digest
```

## Deployment

`make deploy` runs the release gate. It does not commit or push generated files. Cloudflare Pages deploys source commits from `main` through its Git integration.

`make deploy-dry-run` builds and prints the artifact size without performing a deployment.

## Configuration

| Variable | Default |
|---|---|
| `HOST_PORT` | `1313` |
| `HOST_BIND_ADDRESS` | `127.0.0.1` |
| `HUGO_VERSION` | `0.164.0` |
| `HUGO_CACHE` | `~/hugo_cache` |
| `DIST_DIR` | `dist` |
| `ENVIRONMENT` | `development` |
| `LOG_LEVEL` | `info` |

Production settings are in `hugo.yml`; `hugo.dev.yml` overrides only the local base URL.
