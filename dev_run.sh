#!/bin/bash

###############################################################################
# Description: Script to run Hugo development server in a Docker container
# Features:
#   - Runs Hugo server with mounted volumes
#   - Graceful shutdown with proper container cleanup
#   - Customizable via environment variables or command-line arguments
#   - Supports multiple Hugo options
# 
# Required packages:
#   - docker
#
# Usage: 
#   ./run_hugo_dev.sh [OPTIONS]
#
# Options:
#   -n, --name          Container name (default: madpindev)
#   -i, --image         Hugo Docker image (default: hugomods/hugo:exts-non-root)
#   -p, --port          Host port to bind (default: 1313)
#   -c, --cache         Hugo cache directory (default: $HOME/hugo_cache)
#   -d, --no-drafts     Disable building drafts (default: drafts are built)
#   -b, --bind          Bind address (default: 0.0.0.0)
#   -u, --base-url      Base URL for the site (default: http://localhost:1313)
#   -t, --theme         Theme to use (default: none)
#   -e, --environment   Hugo environment (default: development)
#   -w, --no-watch      Disable file system watching (default: enabled)
#   -m, --minify        Minify the output (default: disabled)
#   -l, --log-level     Log level (default: info)
#   -x, --no-ignore-cache  Disable ignoring the cache directory (default: ignore cache)
#   -h, --help          Show this help message and exit
#
# Author: tpinto
###############################################################################

# Default values
CONTAINER_NAME="madpindev"
HUGO_IMAGE="hugomods/hugo:exts-non-root"
HOST_PORT=1313
HUGO_CACHE="${HOME}/hugo_cache"
BUILD_DRAFTS=true
BIND_ADDRESS="0.0.0.0"
BASE_URL="http://localhost:1313"
THEME=""
ENVIRONMENT="development"
WATCH=true
MINIFY=false
LOG_LEVEL="info"
IGNORE_CACHE=true

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -n|--name) CONTAINER_NAME="$2"; shift ;;
        -i|--image) HUGO_IMAGE="$2"; shift ;;
        -p|--port) HOST_PORT="$2"; shift ;;
        -c|--cache) HUGO_CACHE="$2"; shift ;;
        -d|--no-drafts) BUILD_DRAFTS=false ;;
        -b|--bind) BIND_ADDRESS="$2"; shift ;;
        -u|--base-url) BASE_URL="$2"; shift ;;
        -t|--theme) THEME="$2"; shift ;;
        -e|--environment) ENVIRONMENT="$2"; shift ;;
        -w|--no-watch) WATCH=false ;;
        -m|--minify) MINIFY=true ;;
        -l|--log-level) LOG_LEVEL="$2"; shift ;;
        -x|--no-ignore-cache) IGNORE_CACHE=false ;;
        -h|--help) 
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -n, --name          Container name (default: madpindev)"
            echo "  -i, --image         Hugo Docker image (default: hugomods/hugo:exts-non-root)"
            echo "  -p, --port          Host port to bind (default: 1313)"
            echo "  -c, --cache         Hugo cache directory (default: $HOME/hugo_cache)"
            echo "  -d, --no-drafts     Disable building drafts (default: drafts are built)"
            echo "  -b, --bind          Bind address (default: 0.0.0.0)"
            echo "  -u, --base-url      Base URL for the site (default: http://localhost:1313)"
            echo "  -t, --theme         Theme to use (default: none)"
            echo "  -e, --environment   Hugo environment (default: development)"
            echo "  -w, --no-watch      Disable file system watching (default: enabled)"
            echo "  -m, --minify        Minify the output (default: disabled)"
            echo "  -l, --log-level     Log level (default: info)"
            echo "  -x, --no-ignore-cache  Disable ignoring the cache directory (default: ignore cache)"
            echo "  -h, --help          Show this help message and exit"
            exit 0
            ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Logging function
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1"
}

# Cleanup function
cleanup() {
    log "Stopping Hugo server..."
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
    log "Hugo server stopped and container removed."
}

# Set up trap for cleanup on script exit
trap cleanup EXIT

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    log "Error: Docker is not running or you don't have permissions"
    exit 1
fi

# Remove existing container if it exists
log "Removing existing container if it exists..."
docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

# Build Hugo server command
HUGO_COMMAND="server --cleanDestinationDir"
if [[ "$BUILD_DRAFTS" == true ]]; then
    HUGO_COMMAND+=" --buildDrafts"
fi
if [[ "$WATCH" == false ]]; then
    HUGO_COMMAND+=" --watch=false"
fi
if [[ "$MINIFY" == true ]]; then
    HUGO_COMMAND+=" --minify"
fi
if [[ "$IGNORE_CACHE" == true ]]; then
    HUGO_COMMAND+=" --ignoreCache"
fi
HUGO_COMMAND+=" --bind ${BIND_ADDRESS}"
HUGO_COMMAND+=" --baseURL ${BASE_URL}"
HUGO_COMMAND+=" --environment ${ENVIRONMENT}"
HUGO_COMMAND+=" --logLevel ${LOG_LEVEL}"
if [[ -n "$THEME" ]]; then
    HUGO_COMMAND+=" --theme ${THEME}"
fi

# Run Hugo server in Docker
log "Starting Hugo development server with the following settings:"
log "  Container Name: ${CONTAINER_NAME}"
log "  Hugo Image: ${HUGO_IMAGE}"
log "  Host Port: ${HOST_PORT}"
log "  Hugo Cache: ${HUGO_CACHE}"
log "  Build Drafts: ${BUILD_DRAFTS}"
log "  Bind Address: ${BIND_ADDRESS}"
log "  Base URL: ${BASE_URL}"
log "  Theme: ${THEME:-none}"
log "  Environment: ${ENVIRONMENT}"
log "  Watch: ${WATCH}"
log "  Minify: ${MINIFY}"
log "  Log Level: ${LOG_LEVEL}"
log "  Ignore Cache: ${IGNORE_CACHE}"

docker run --rm \
    --name ${CONTAINER_NAME} \
    -v "${PWD}":/src \
    -v "${HUGO_CACHE}":/tmp/hugo_cache \
    -u 1002:1002 \
    -p ${HOST_PORT}:1313 \
    ${HUGO_IMAGE} \
    ${HUGO_COMMAND}

log "Hugo development server is running on port ${HOST_PORT}."