###############################################################################
# Hugo Blog Makefile
#
# Description:
#   Comprehensive Makefile for managing a Hugo blog with Docker support
#
# Features:
#   - Development server management
#   - Post creation and management
#   - Release verification
#   - Pagefind search indexing
#   - Docker-based Hugo execution
#
# Usage:
#   make help          - Show all available commands
#   make dev           - Start development server
#   make new           - Create a new blog post
#   make verify        - Run the release gate
#   make search        - Build the search index
#
# Author: tpinto
###############################################################################

.PHONY: help dev serve production-server stop logs shell build draft test verify clean clean-cache clean-all new list-posts list-drafts publish deploy deploy-dry-run search search-setup check-docker check-server stats check-images version config docker-pull docker-clean quick-publish new-and-edit

# Default values (can be overridden via environment variables or command line)
CONTAINER_NAME ?= madpindev
HUGO_VERSION ?= 0.164.0
HUGO_IMAGE ?= hugomods/hugo:non-root-$(HUGO_VERSION)@sha256:9155e9ed6fcb118f1ff95c2437c22a2e514a515700524954b6891e13e0f5ea7f
HOST_PORT ?= 1313
HUGO_CACHE ?= $(HOME)/hugo_cache
BIND_ADDRESS ?= 0.0.0.0
HOST_BIND_ADDRESS ?= 127.0.0.1
BASE_URL ?= http://localhost:$(HOST_PORT)
ENVIRONMENT ?= development
LOG_LEVEL ?= info
DIST_DIR ?= dist
POSTS_DIR ?= content/post
DEV_BUILD_FLAGS ?= --buildDrafts

# Docker user ID (adjust if needed)
DOCKER_UID ?= $(shell id -u)
DOCKER_GID ?= $(shell id -g)

# Colors for output
COLOR_RESET := \033[0m
COLOR_GREEN := \033[0;32m
COLOR_YELLOW := \033[0;33m
COLOR_BLUE := \033[0;34m
COLOR_RED := \033[0;31m

# Default target
.DEFAULT_GOAL := help

###############################################################################
# Help Target
###############################################################################

help: ## Show this help message
	@echo "$(COLOR_GREEN)Hugo Blog Management$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_BLUE)Available targets:$(COLOR_RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(COLOR_YELLOW)%-20s$(COLOR_RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(COLOR_BLUE)Configuration:$(COLOR_RESET)"
	@echo "  CONTAINER_NAME = $(CONTAINER_NAME)"
	@echo "  HUGO_IMAGE     = $(HUGO_IMAGE)"
	@echo "  HOST_PORT      = $(HOST_PORT)"
	@echo "  HUGO_CACHE     = $(HUGO_CACHE)"
	@echo "  ENVIRONMENT    = $(ENVIRONMENT)"
	@echo ""
	@echo "$(COLOR_BLUE)Examples:$(COLOR_RESET)"
	@echo "  make dev                    - Start development server"
	@echo "  make dev HOST_PORT=8080     - Start on port 8080"
	@echo "  make new SLUG=my-post          - Create a page-bundle post"
	@echo "  make verify                   - Run the release gate"
	@echo ""
	@echo "$(COLOR_GREEN)Note: Local development uses 'hugo.dev.yml' to ensure correct image URLs.$(COLOR_RESET)"

###############################################################################
# Development Server Targets
###############################################################################

dev: ## Start Hugo development server with drafts
	@echo "$(COLOR_GREEN)Starting Hugo development server...$(COLOR_RESET)"
	@docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	@mkdir -p "$(HUGO_CACHE)"
	@echo "$(COLOR_BLUE)Server will be available at: $(BASE_URL)$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)Using config files: hugo.yml,hugo.dev.yml$(COLOR_RESET)"
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		-p $(HOST_BIND_ADDRESS):$(HOST_PORT):1313 \
		$(HUGO_IMAGE) \
		server $(DEV_BUILD_FLAGS) --ignoreCache \
		--bind $(BIND_ADDRESS) --baseURL $(BASE_URL) \
		--config hugo.yml,hugo.dev.yml \
		--environment $(ENVIRONMENT) --logLevel $(LOG_LEVEL) \
		--appendPort=false --disableFastRender

serve: dev ## Alias for 'dev' target

production-server: ## Start Hugo development server without drafts (production mode)
	@$(MAKE) dev ENVIRONMENT=production DEV_BUILD_FLAGS=

stop: ## Stop the running Hugo development server
	@echo "$(COLOR_YELLOW)Stopping Hugo server...$(COLOR_RESET)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || echo "$(COLOR_RED)No server running$(COLOR_RESET)"
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true

logs: ## Show logs from the running Hugo server
	@docker logs -f $(CONTAINER_NAME)

shell: ## Open a shell in the Hugo container
	@docker exec -it $(CONTAINER_NAME) /bin/sh

###############################################################################
# Build Targets
###############################################################################

build: ## Build the Hugo site for production
	@echo "$(COLOR_GREEN)Building Hugo site with Hugo $(HUGO_VERSION)...$(COLOR_RESET)"
	@mkdir -p "$(HUGO_CACHE)" "$(DIST_DIR)"
	docker run --rm \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		$(HUGO_IMAGE) \
		--cleanDestinationDir --minify --environment production --destination "$(DIST_DIR)" --panicOnWarning
	@npm run search
	@echo "$(COLOR_GREEN)Build complete: $(DIST_DIR)/$(COLOR_RESET)"

draft: ## Build the Hugo site including drafts
	@echo "$(COLOR_GREEN)Building Hugo site with drafts...$(COLOR_RESET)"
	@mkdir -p "$(HUGO_CACHE)" .tmp/drafts
	docker run --rm \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		$(HUGO_IMAGE) \
		--cleanDestinationDir --buildDrafts --buildFuture --environment development --destination .tmp/drafts --panicOnWarning

test: verify ## Build and test the site

verify: ## Run the complete Docker-backed release gate
	@npm run check:content
	@$(MAKE) build
	@npm run check:output
	@npm run check:html
	@npm run test:e2e
	@$(MAKE) draft

clean: ## Clean generated files and cache
	@echo "$(COLOR_YELLOW)Cleaning generated files...$(COLOR_RESET)"
	@rm -rf "$(DIST_DIR)" .tmp resources/_gen/
	@echo "$(COLOR_GREEN)Clean complete!$(COLOR_RESET)"}

clean-cache: ## Clean Hugo cache
	@echo "$(COLOR_YELLOW)Cleaning Hugo cache...$(COLOR_RESET)"
	@test -n "$(HUGO_CACHE)" -a "$(HUGO_CACHE)" != "/" -a "$(HUGO_CACHE)" != "$(HOME)"
	@rm -rf "$(HUGO_CACHE)"
	@echo "$(COLOR_GREEN)Cache cleaned!$(COLOR_RESET)"}

clean-all: clean clean-cache ## Clean everything (generated files and cache)

###############################################################################
# Post Management Targets
###############################################################################

new: ## Create a new page-bundle post (Usage: make new SLUG=my-post)
	@if [ -z "$(SLUG)" ]; then \
		echo "$(COLOR_RED)Error: SLUG is required$(COLOR_RESET)"; \
		echo "Usage: make new SLUG=my-post"; \
		exit 1; \
	fi
	@if ! printf '%s' "$(SLUG)" | grep -Eq '^[a-z0-9]+(-[a-z0-9]+)*$$'; then \
		echo "$(COLOR_RED)Error: SLUG must contain lowercase letters, numbers, and single hyphens$(COLOR_RESET)"; \
		exit 1; \
	fi
	@mkdir -p "$(HUGO_CACHE)"
	docker run --rm \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		$(HUGO_IMAGE) \
		new content --kind post "post/$(SLUG)/index.en.md"
	@echo "$(COLOR_YELLOW)Add the cover image at $(POSTS_DIR)/$(SLUG)/cover.jpg$(COLOR_RESET)"

list-posts: ## List all published blog posts
	@hugo list published --noBuildLock

list-drafts: ## List all draft posts
	@hugo list drafts --noBuildLock

publish: ## Publish a page-bundle draft (Usage: make publish POST=my-post)
	@if [ -z "$(POST)" ]; then \
		echo "$(COLOR_RED)Error: POST is required$(COLOR_RESET)"; \
		echo "Usage: make publish POST=my-post"; \
		exit 1; \
	fi
	@if [ ! -f "$(POSTS_DIR)/$(POST)/index.en.md" ]; then \
		echo "$(COLOR_RED)Error: Post not found: $(POSTS_DIR)/$(POST)/index.en.md$(COLOR_RESET)"; \
		exit 1; \
	fi
	@echo "$(COLOR_GREEN)Publishing post: $(POST)$(COLOR_RESET)"
	@sed -i.bak 's/^draft: true$$/draft: false/' "$(POSTS_DIR)/$(POST)/index.en.md"
	@rm -f "$(POSTS_DIR)/$(POST)/index.en.md.bak"
	@echo "$(COLOR_GREEN)Post published!$(COLOR_RESET)"}

###############################################################################
# Deployment Targets
###############################################################################

deploy: verify ## Verify the artifact used by Cloudflare Git deployment
	@echo "$(COLOR_GREEN)Verification complete. Cloudflare deploys the main branch through its Git integration.$(COLOR_RESET)"

deploy-dry-run: build ## Build and inspect the Cloudflare deployment artifact
	@echo "$(COLOR_BLUE)Artifact summary:$(COLOR_RESET)"
	@du -sh "$(DIST_DIR)"

###############################################################################
# Search Index Targets
###############################################################################

search: ## Build the Pagefind search index
	@echo "$(COLOR_GREEN)Building Pagefind search index...$(COLOR_RESET)"
	@npm run search
	@echo "$(COLOR_GREEN)Pagefind index built!$(COLOR_RESET)"

search-setup: ## Install locked search and verification dependencies
	@echo "$(COLOR_GREEN)Installing locked Node dependencies...$(COLOR_RESET)"
	@npm ci

###############################################################################
# Docker Management Targets
###############################################################################

docker-pull: ## Pull the pinned Hugo Docker image
	@echo "$(COLOR_GREEN)Pulling Hugo Docker image...$(COLOR_RESET)"
	@docker pull $(HUGO_IMAGE)

docker-clean: ## Remove the Hugo development container
	@echo "$(COLOR_YELLOW)Cleaning Docker resources...$(COLOR_RESET)"
	@docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(COLOR_GREEN)Docker cleanup complete!$(COLOR_RESET)"

###############################################################################
# Utility Targets
###############################################################################

version: ## Show Hugo version
	@docker run --rm $(HUGO_IMAGE) version

config: ## Show current configuration
	@echo "$(COLOR_BLUE)Current Configuration:$(COLOR_RESET)"
	@echo "  CONTAINER_NAME : $(CONTAINER_NAME)"
	@echo "  HUGO_IMAGE     : $(HUGO_IMAGE)"
	@echo "  HOST_PORT      : $(HOST_PORT)"
	@echo "  HUGO_CACHE     : $(HUGO_CACHE)"
	@echo "  BIND_ADDRESS   : $(BIND_ADDRESS)"
	@echo "  BASE_URL       : $(BASE_URL)"
	@echo "  ENVIRONMENT    : $(ENVIRONMENT)"
	@echo "  LOG_LEVEL      : $(LOG_LEVEL)"
	@echo "  POSTS_DIR      : $(POSTS_DIR)"
	@echo "  DOCKER_UID     : $(DOCKER_UID)"
	@echo "  DOCKER_GID     : $(DOCKER_GID)"
	@echo ""
	@echo "$(COLOR_BLUE)Hugo Config Files:$(COLOR_RESET)"
	@if [ -f "hugo.yml" ]; then \
		echo "  $(COLOR_GREEN)✓$(COLOR_RESET) hugo.yml (production baseURL: $$(grep '^baseURL:' hugo.yml | awk '{print $$2}'))"; \
	else \
		echo "  $(COLOR_RED)✗$(COLOR_RESET) hugo.yml (missing)"; \
	fi
	@if [ -f "hugo.dev.yml" ]; then \
		echo "  $(COLOR_GREEN)✓$(COLOR_RESET) hugo.dev.yml (dev baseURL: $$(grep '^baseURL:' hugo.dev.yml | awk '{print $$2}'))"; \
	else \
		echo "  $(COLOR_YELLOW)!$(COLOR_RESET) hugo.dev.yml (missing - run 'make dev' to create)"; \
	fi

check-docker: ## Check if Docker is running
	@docker info >/dev/null 2>&1 && \
		echo "$(COLOR_GREEN)✓ Docker is running$(COLOR_RESET)" || \
		(echo "$(COLOR_RED)✗ Docker is not running$(COLOR_RESET)" && exit 1)

stats: ## Show blog statistics
	@echo "$(COLOR_BLUE)Blog Statistics:$(COLOR_RESET)"
	@hugo list all --noBuildLock
	@if [ -d "$(DIST_DIR)" ]; then \
		echo "  Artifact size: $$(du -sh "$(DIST_DIR)" | cut -f1)"; \
	fi

check-images: ## Validate post front matter and page-bundle images
	@npm run check:content

check-server: ## Check if the development server is running
	@if docker ps | grep -q $(CONTAINER_NAME); then \
		echo "$(COLOR_GREEN)✓ Hugo server is running$(COLOR_RESET)"; \
		echo "$(COLOR_BLUE)Container status:$(COLOR_RESET)"; \
		docker ps --filter name=$(CONTAINER_NAME) --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"; \
	else \
		echo "$(COLOR_RED)✗ Hugo server is not running$(COLOR_RESET)"; \
		echo "Use 'make dev' to start the server"; \
	fi

###############################################################################
# Quick Workflow Targets
###############################################################################

quick-publish: ## Publish a page-bundle post and start the development server
	@$(MAKE) publish POST=$(POST)
	@$(MAKE) dev

new-and-edit: ## Create new post and start dev server
	@$(MAKE) new
	@echo "$(COLOR_GREEN)Starting development server...$(COLOR_RESET)"
	@sleep 2
	@$(MAKE) dev

