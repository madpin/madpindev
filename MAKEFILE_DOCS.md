# Hugo Blog - Makefile Documentation

This project uses a comprehensive Makefile for all development, build, and deployment tasks.

## Quick Start

```bash
# Show all available commands
make help

# Start development server
make dev

# Create a new post
make new TITLE="My Post Title"

# Deploy to production
make deploy
```

## Common Commands

### Development
- `make dev` - Start Hugo development server with drafts (uses hugo.dev.yml for local baseURL)
- `make serve` - Alias for `make dev`
- `make stop` - Stop the running development server
- `make logs` - View server logs
- `make production-server` - Start server without drafts

### Post Management
- `make new` - Create new post interactively
- `make new TITLE="My Title" SUBTITLE="My Subtitle"` - Create post with title
- `make list-posts` - List all blog posts
- `make list-drafts` - List draft posts
- `make publish POST=2024-12-06-my-post.md` - Publish a draft

### Build & Deploy
- `make build` - Build site for production
- `make deploy` - Build and deploy to GitHub
- `make deploy MSG="Custom message"` - Deploy with custom commit message
- `make clean` - Clean generated files

### Diagnostics
- `make stats` - Show blog statistics
- `make check-images` - Check if post images exist
- `make debug-urls` - Test if images are accessible (requires running server)
- `make config` - Show current configuration

## Configuration Files

### hugo.yml
Main Hugo configuration with production settings (baseURL: https://madpin.dev)

### hugo.dev.yml
Development configuration override (baseURL: http://localhost:1313)
This file is automatically used by `make dev` to ensure images and assets load correctly in local development.

## Image Fix

If images aren't showing in local development but work in production, this is because Hugo uses the production baseURL from `hugo.yml`. The Makefile now uses both config files:

```bash
make dev  # Automatically uses: --config hugo.yml,hugo.dev.yml
```

This ensures the development server uses `http://localhost:1313` as the base URL for all assets.

## Custom Configuration

You can override any Makefile variable:

```bash
# Use different port
make dev HOST_PORT=8080

# Use different Docker user
make dev DOCKER_UID=1000 DOCKER_GID=1000

# Use different Hugo image
make dev HUGO_IMAGE=klakegg/hugo:latest
```

## Requirements

- Docker
- make
- npm (for Algolia search indexing)

## Troubleshooting

### Images not showing in development
Run `make config` to verify baseURL settings and ensure `hugo.dev.yml` exists.

### Server won't start
Check if Docker is running: `make check-docker`

### Posts not building
Check for YAML errors in frontmatter. Look at the server logs with `make logs`.

## Replaced Scripts

This Makefile replaces the following shell scripts:
- `dev_run.sh` → `make dev`
- `new_post.sh` → `make new`
- `deploy.sh` → `make deploy`
- `build_algolia_index.sh` → `make algolia`

