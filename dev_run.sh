#!/bin/bash

###############################################################################
# Description: Script to run Hugo development server in a Docker container
# Features:
#   - Runs Hugo server with mounted volumes
#   - Graceful shutdown with proper container cleanup
# 
# Required packages:
#   - docker
#
# Usage: 
#   ./run_hugo_dev.sh
#
# Author: tpinto
###############################################################################

# Constants
CONTAINER_NAME="madpindev"
HUGO_IMAGE="hugomods/hugo:exts-non-root"

# Cleanup function
cleanup() {
    echo -e "\nStopping Hugo server..."
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
}

# Set up trap for cleanup on script exit
trap cleanup EXIT

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker is not running or you don't have permissions"
    exit 1
fi

# Remove existing container if it exists
docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

# Run Hugo server in Docker
echo "Starting Hugo development server..."
docker run --rm \
    --name ${CONTAINER_NAME} \
    -v "${PWD}":/src \
    -v "${HOME}/hugo_cache":/tmp/hugo_cache \
    -u 1002:1002 \
    -p 1313:1313 \
    ${HUGO_IMAGE} \
    server --disableFastRender --buildDrafts
