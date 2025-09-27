# MadPinDev Personal Blog

Personal blog built with Hugo static site generator using Clean White theme.

## Quick Start

### Prerequisites
- Docker installed on your system
- Git (optional, for version control)

### Running Locally with Docker

1. Clone this repository with submodules:
```bash
git clone --recurse-submodules git@github.com:madpin/madpindev.git
cd madpindev
```

2. Start the Hugo server using Docker:
```bash
docker run --rm \
--name madpindev \
-v ${PWD}:/src \
-v ${HOME}/hugo_cache:/tmp/hugo_cache \
-u 1002:1002 \
-p 1313:1313 \
hugomods/hugo:exts-non-root \
server && docker stop madpindev
```

3. View your site at: http://localhost:1313

### Alternative: Using the Development Script

For a more convenient development experience, you can use the included `dev_run.sh` script:

```bash
./dev_run.sh
```

This script provides additional features and options:
- Graceful shutdown with proper container cleanup
- Customizable via command-line arguments
- Support for multiple Hugo options (drafts, minify, themes, etc.)

To see all available options:
```bash
./dev_run.sh --help
```

Common usage examples:
```bash
# Run with default settings
./dev_run.sh

# Run on a different port
./dev_run.sh --port 8080

# Run without building drafts
./dev_run.sh --no-drafts

# Run with minification enabled
./dev_run.sh --minify
```

### Docker Command Explanation
- `--rm`: Automatically remove container when it exits
- `--name madpindev`: Names the container
- `-v ${PWD}:/src`: Mounts current directory to /src in container
- `-v ${HOME}/hugo_cache:/tmp/hugo_cache`: Persists Hugo cache
- `-u 1002:1002`: Runs as user 1002 (non-root)
- `-p 1313:1313`: Maps container port 1313 to host
- `server`: Runs Hugo's development server

## Development

### File Structure
```
.
├── content/          # Blog posts and pages
├── static/          # Static files (images, css, js)
├── themes/          # Hugo themes
└── config.toml      # Site configuration
```

### Adding New Content
```bash
docker run --rm \
--name madpindev \
-v ${PWD}:/src \
-v ${HOME}/hugo_cache:/tmp/hugo_cache \
-u 1002:1002 \
hugomods/hugo:exts-non-root \
new post/my-new-post.md
```

## Deployment
[Add your deployment instructions here]

## License
[Add your license information here]
