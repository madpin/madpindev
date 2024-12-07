# MadPinDev Personal Blog

Personal blog built with Hugo static site generator using Clean White theme.

## Quick Start

### Prerequisites
- Docker installed on your system
- Git (optional, for version control)

### Running Locally with Docker

1. Clone this repository (if using Git):
```bash
git clone <your-repo-url>
cd <repo-directory>
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
