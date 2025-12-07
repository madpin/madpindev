###############################################################################
# Hugo Blog Makefile
#
# Description:
#   Comprehensive Makefile for managing a Hugo blog with Docker support
#
# Features:
#   - Development server management
#   - Post creation and management
#   - Deployment automation
#   - Search index building
#   - Docker-based Hugo execution
#
# Usage:
#   make help          - Show all available commands
#   make dev           - Start development server
#   make new           - Create a new blog post
#   make deploy        - Deploy to GitHub
#   make algolia       - Build search index
#
# Author: tpinto
###############################################################################

.PHONY: help dev serve new deploy algolia build clean draft production test stop logs shell

# Default values (can be overridden via environment variables or command line)
CONTAINER_NAME ?= madpindev
HUGO_IMAGE ?= hugomods/hugo:exts-non-root
HOST_PORT ?= 1313
HUGO_CACHE ?= $(HOME)/hugo_cache
BIND_ADDRESS ?= 0.0.0.0
BASE_URL ?= http://localhost:$(HOST_PORT)
ENVIRONMENT ?= development
LOG_LEVEL ?= info
POSTS_DIR ?= content/post
IMG_DIR ?= static/img/posts
AUTHOR ?= Thiago MadPin

# Docker user ID (adjust if needed)
DOCKER_UID ?= 1002
DOCKER_GID ?= 1002

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
	@echo "  make new TITLE=\"My Post\"    - Create new post with title"
	@echo "  make deploy MSG=\"Update\"     - Deploy with custom message"
	@echo ""
	@echo "$(COLOR_GREEN)Note: Local development uses 'hugo.dev.yml' to ensure correct image URLs.$(COLOR_RESET)"

###############################################################################
# Development Server Targets
###############################################################################

dev: ## Start Hugo development server with drafts
	@echo "$(COLOR_GREEN)Starting Hugo development server...$(COLOR_RESET)"
	@docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	@rm -rf public/
	@mkdir -p $(HUGO_CACHE)
	@echo "$(COLOR_BLUE)Server will be available at: $(BASE_URL)$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)Images should be accessible at: $(BASE_URL)/img/posts/$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)Using config files: hugo.yml,hugo.dev.yml$(COLOR_RESET)"
	docker run --rm \
		--name $(CONTAINER_NAME) \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		-p $(HOST_PORT):1313 \
		-e HUGO_BASEURL=$(BASE_URL) \
		$(HUGO_IMAGE) \
		server --cleanDestinationDir --buildDrafts --ignoreCache \
		--bind $(BIND_ADDRESS) --baseURL $(BASE_URL) \
		--config hugo.yml,hugo.dev.yml \
		--environment $(ENVIRONMENT) --logLevel debug \
		--appendPort=false --disableFastRender --renderStaticToDisk

serve: dev ## Alias for 'dev' target

production-server: ## Start Hugo development server without drafts (production mode)
	@$(MAKE) dev ENVIRONMENT=production BUILD_DRAFTS=false

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
	@echo "$(COLOR_GREEN)Building Hugo site...$(COLOR_RESET)"
	@mkdir -p $(HUGO_CACHE)
	docker run --rm \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		$(HUGO_IMAGE) \
		--cleanDestinationDir --minify --environment production
	@echo "$(COLOR_GREEN)Build complete!$(COLOR_RESET)"

draft: ## Build the Hugo site including drafts
	@echo "$(COLOR_GREEN)Building Hugo site with drafts...$(COLOR_RESET)"
	@mkdir -p $(HUGO_CACHE)
	docker run --rm \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		$(HUGO_IMAGE) \
		--cleanDestinationDir --buildDrafts --environment development

test: ## Build and test the site (check for errors)
	@echo "$(COLOR_GREEN)Testing Hugo site build...$(COLOR_RESET)"
	@mkdir -p $(HUGO_CACHE)
	docker run --rm \
		-v "$(PWD)":/src \
		-v "$(HUGO_CACHE)":/tmp/hugo_cache \
		-u $(DOCKER_UID):$(DOCKER_GID) \
		$(HUGO_IMAGE) \
		--cleanDestinationDir --buildDrafts --environment development --logLevel debug

clean: ## Clean generated files and cache
	@echo "$(COLOR_YELLOW)Cleaning generated files...$(COLOR_RESET)"
	@rm -rf public/ resources/_gen/
	@echo "$(COLOR_GREEN)Clean complete!$(COLOR_RESET)"

clean-cache: ## Clean Hugo cache
	@echo "$(COLOR_YELLOW)Cleaning Hugo cache...$(COLOR_RESET)"
	@rm -rf $(HUGO_CACHE)
	@echo "$(COLOR_GREEN)Cache cleaned!$(COLOR_RESET)"

clean-all: clean clean-cache ## Clean everything (generated files and cache)

###############################################################################
# Post Management Targets
###############################################################################

new: ## Create a new blog post (interactive: make new or with title: make new TITLE="My Title")
	@echo "$(COLOR_GREEN)Creating new blog post...$(COLOR_RESET)"
	@mkdir -p $(POSTS_DIR) $(IMG_DIR)
	@if [ -z "$(TITLE)" ]; then \
		read -p "Enter post title: " title; \
		read -p "Enter post subtitle (optional): " subtitle; \
	else \
		title="$(TITLE)"; \
		subtitle="$(SUBTITLE)"; \
	fi; \
	year=$$(date +"%Y"); \
	month=$$(date +"%m"); \
	day=$$(date +"%d"); \
	today="$$year-$$month-$$day"; \
	url_title=$$(echo "$$title" | sed 's/[^a-zA-Z0-9 ]//g' | tr '[:upper:]' '[:lower:]' | tr ' ' '-'); \
	filename="$(POSTS_DIR)/$$today-$$url_title.md"; \
	img_filename="/img/posts/$$today-$$url_title.jpg"; \
	url="/$$year/$$month/$$day-$$url_title/"; \
	echo "---" > "$$filename"; \
	echo "layout:      post" >> "$$filename"; \
	echo "draft:       true" >> "$$filename"; \
	echo "title:       \"$$title\"" >> "$$filename"; \
	if [ -n "$$subtitle" ]; then echo "subtitle:    \"$$subtitle\"" >> "$$filename"; fi; \
	echo "date:        $$today" >> "$$filename"; \
	echo "author:      \"$(AUTHOR)\"" >> "$$filename"; \
	echo "URL:         \"$$url\"" >> "$$filename"; \
	echo "image:       \"$$img_filename\"" >> "$$filename"; \
	echo "description: \"$$img_filename\"" >> "$$filename"; \
	echo "categories:  [ Tech ]" >> "$$filename"; \
	echo "tags:" >> "$$filename"; \
	echo "    - " >> "$$filename"; \
	echo "---" >> "$$filename"; \
	echo "" >> "$$filename"; \
	echo "Write your post content here..." >> "$$filename"; \
	echo "$(COLOR_GREEN)Created new post: $$filename$(COLOR_RESET)"; \
	echo "$(COLOR_YELLOW)Don't forget to add an image at: static$$img_filename$(COLOR_RESET)"

list-posts: ## List all blog posts
	@echo "$(COLOR_BLUE)Blog posts:$(COLOR_RESET)"
	@ls -1t $(POSTS_DIR)/*.md 2>/dev/null | head -20 || echo "$(COLOR_RED)No posts found$(COLOR_RESET)"

list-drafts: ## List all draft posts
	@echo "$(COLOR_BLUE)Draft posts:$(COLOR_RESET)"
	@grep -l "draft:.*true" $(POSTS_DIR)/*.md 2>/dev/null || echo "$(COLOR_RED)No drafts found$(COLOR_RESET)"

publish: ## Publish a draft post (set draft to false) - Usage: make publish POST=filename.md
	@if [ -z "$(POST)" ]; then \
		echo "$(COLOR_RED)Error: POST variable required$(COLOR_RESET)"; \
		echo "Usage: make publish POST=2024-12-06-my-post.md"; \
		exit 1; \
	fi
	@if [ ! -f "$(POSTS_DIR)/$(POST)" ]; then \
		echo "$(COLOR_RED)Error: Post not found: $(POSTS_DIR)/$(POST)$(COLOR_RESET)"; \
		exit 1; \
	fi
	@echo "$(COLOR_GREEN)Publishing post: $(POST)$(COLOR_RESET)"
	@sed -i.bak 's/draft:.*true/draft:       false/' "$(POSTS_DIR)/$(POST)"
	@rm -f "$(POSTS_DIR)/$(POST).bak"
	@echo "$(COLOR_GREEN)Post published!$(COLOR_RESET)"

###############################################################################
# Deployment Targets
###############################################################################

deploy: build ## Deploy site to GitHub (Usage: make deploy or make deploy MSG="Custom message")
	@echo "$(COLOR_GREEN)Deploying updates to GitHub...$(COLOR_RESET)"
	@cd public && \
	git add . && \
	if [ -n "$(MSG)" ]; then \
		git commit -m "$(MSG)"; \
	else \
		git commit -m "rebuilding site $$(date)"; \
	fi && \
	git push origin master
	@echo "$(COLOR_GREEN)Deployment complete!$(COLOR_RESET)"

deploy-dry-run: build ## Show what would be deployed without actually deploying
	@echo "$(COLOR_BLUE)Files that would be deployed:$(COLOR_RESET)"
	@cd public && git status

###############################################################################
# Search Index Targets
###############################################################################

algolia: ## Build Algolia search index
	@echo "$(COLOR_GREEN)Building Algolia search index...$(COLOR_RESET)"
	@npm run algolia
	@echo "$(COLOR_GREEN)Algolia index built!$(COLOR_RESET)"

algolia-setup: ## Setup Algolia search dependencies
	@echo "$(COLOR_GREEN)Installing Algolia dependencies...$(COLOR_RESET)"
	@npm install

###############################################################################
# Git Targets
###############################################################################

git-status: ## Show git status for both main repo and public submodule
	@echo "$(COLOR_BLUE)Main repository status:$(COLOR_RESET)"
	@git status
	@echo ""
	@echo "$(COLOR_BLUE)Public submodule status:$(COLOR_RESET)"
	@cd public && git status

git-add: ## Stage current changes (Usage: make git-add or make git-add FILES="file1 file2")
	@if [ -z "$(FILES)" ]; then \
		echo "$(COLOR_GREEN)Staging all changes...$(COLOR_RESET)"; \
		git add -A; \
	else \
		echo "$(COLOR_GREEN)Staging: $(FILES)$(COLOR_RESET)"; \
		git add $(FILES); \
	fi

git-commit: ## Commit changes (Usage: make git-commit MSG="commit message")
	@if [ -z "$(MSG)" ]; then \
		echo "$(COLOR_RED)Error: MSG variable required$(COLOR_RESET)"; \
		echo "Usage: make git-commit MSG=\"Your commit message\""; \
		exit 1; \
	fi
	@git commit -m "$(MSG)"

git-push: ## Push changes to remote
	@echo "$(COLOR_GREEN)Pushing changes to remote...$(COLOR_RESET)"
	@git push origin main

git-sync: git-add git-commit git-push ## Stage, commit, and push changes (Usage: make git-sync MSG="message")

###############################################################################
# Docker Management Targets
###############################################################################

docker-pull: ## Pull the latest Hugo Docker image
	@echo "$(COLOR_GREEN)Pulling Hugo Docker image...$(COLOR_RESET)"
	@docker pull $(HUGO_IMAGE)

docker-clean: ## Remove Hugo Docker containers and images
	@echo "$(COLOR_YELLOW)Cleaning Docker resources...$(COLOR_RESET)"
	@docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(COLOR_GREEN)Docker cleanup complete!$(COLOR_RESET)"

###############################################################################
# Utility Targets
###############################################################################

debug-urls: ## Test if images are accessible (requires server to be running)
	@echo "$(COLOR_BLUE)Testing image accessibility...$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)Make sure the server is running with 'make dev' first!$(COLOR_RESET)"
	@echo ""
	@if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:$(HOST_PORT) | grep -q "200"; then \
		echo "$(COLOR_RED)✗ Server not responding at http://localhost:$(HOST_PORT)$(COLOR_RESET)"; \
		echo "Start the server with: make dev"; \
		exit 1; \
	fi
	@echo "$(COLOR_GREEN)✓ Server is running$(COLOR_RESET)"
	@echo ""
	@echo "Testing sample images:"
	@test_img="/img/posts/2025-12-06-o-grande-sequestro-ecolgico.jpg"; \
	url="http://localhost:$(HOST_PORT)$$test_img"; \
	code=$$(curl -s -o /dev/null -w "%{http_code}" "$$url"); \
	if [ "$$code" = "200" ]; then \
		echo "$(COLOR_GREEN)✓$(COLOR_RESET) $$test_img (HTTP $$code)"; \
	else \
		echo "$(COLOR_RED)✗$(COLOR_RESET) $$test_img (HTTP $$code)"; \
	fi
	@echo ""
	@echo "$(COLOR_BLUE)Checking generated HTML...$(COLOR_RESET)"
	@echo "Fetching a post page to check image URLs..."
	@curl -s "http://localhost:$(HOST_PORT)/2025/12/06-o-grande-sequestro-ecolgico/" 2>/dev/null | \
		grep -o "url('[^']*')" | head -5 || echo "Could not fetch page"

inspect-html: ## Inspect generated HTML for a specific post (Usage: make inspect-html POST=2025-12-06-post-name)
	@if [ -z "$(POST)" ]; then \
		echo "$(COLOR_RED)Error: POST variable required$(COLOR_RESET)"; \
		echo "Usage: make inspect-html POST=2025-12-06-o-grande-sequestro-ecolgico"; \
		exit 1; \
	fi
	@url="http://localhost:$(HOST_PORT)/$$(echo $(POST) | sed 's/\.md//' | sed 's/content\/post\///' | sed 's/\([0-9]\{4\}\)-\([0-9]\{2\}\)-\([0-9]\{2\}\)-\(.*\)/\1\/\2\/\3-\4\//')"; \
	echo "$(COLOR_BLUE)Fetching: $$url$(COLOR_RESET)"; \
	echo ""; \
	curl -s "$$url" | grep -E "(background-image|<img|src=)" | head -20

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
	@echo "  IMG_DIR        : $(IMG_DIR)"
	@echo "  AUTHOR         : $(AUTHOR)"
	@echo "  DOCKER_UID     : $(DOCKER_UID)"
	@echo "  DOCKER_GID     : $(DOCKER_GID)"
	@echo ""
	@echo "$(COLOR_BLUE)Hugo Config Files:$(COLOR_RESET)"
	@if [ -f "hugo.yml" ]; then \
		echo "  $(COLOR_GREEN)✓$(COLOR_RESET) hugo.yml (production baseURL: $$(grep '^baseurl:' hugo.yml | awk '{print $$2}'))"; \
	else \
		echo "  $(COLOR_RED)✗$(COLOR_RESET) hugo.yml (missing)"; \
	fi
	@if [ -f "hugo.dev.yml" ]; then \
		echo "  $(COLOR_GREEN)✓$(COLOR_RESET) hugo.dev.yml (dev baseURL: $$(grep '^baseurl:' hugo.dev.yml | awk '{print $$2}'))"; \
	else \
		echo "  $(COLOR_YELLOW)!$(COLOR_RESET) hugo.dev.yml (missing - run 'make dev' to create)"; \
	fi

check-docker: ## Check if Docker is running
	@docker info >/dev/null 2>&1 && \
		echo "$(COLOR_GREEN)✓ Docker is running$(COLOR_RESET)" || \
		(echo "$(COLOR_RED)✗ Docker is not running$(COLOR_RESET)" && exit 1)

stats: ## Show blog statistics
	@echo "$(COLOR_BLUE)Blog Statistics:$(COLOR_RESET)"
	@echo "  Total posts    : $$(ls -1 $(POSTS_DIR)/*.md 2>/dev/null | wc -l | tr -d ' ')"
	@echo "  Draft posts    : $$(grep -l 'draft:.*true' $(POSTS_DIR)/*.md 2>/dev/null | wc -l | tr -d ' ')"
	@echo "  Published posts: $$(grep -l 'draft:.*false' $(POSTS_DIR)/*.md 2>/dev/null | wc -l | tr -d ' ')"
	@echo "  Total images   : $$(ls -1 $(IMG_DIR)/*.{jpg,jpeg,png,gif,webp} 2>/dev/null | wc -l | tr -d ' ')"
	@if [ -d "public" ]; then \
		echo "  Site size      : $$(du -sh public 2>/dev/null | cut -f1)"; \
	fi

check-images: ## Check if post images exist
	@echo "$(COLOR_BLUE)Checking post images...$(COLOR_RESET)"
	@for post in $(POSTS_DIR)/*.md; do \
		if [ -f "$$post" ]; then \
			image=$$(grep "^image:" "$$post" | head -1 | sed 's/^image:[[:space:]]*//; s/"//g; s/'\''//g' | xargs); \
			if [ -n "$$image" ]; then \
				post_name=$$(basename "$$post"); \
				if echo "$$image" | grep -q "^http"; then \
					echo "$(COLOR_YELLOW)→$(COLOR_RESET) $$post_name -> $$image (external)"; \
				elif echo "$$image" | grep -q "^static/"; then \
					img_path="$$image"; \
					if [ -f "$$img_path" ]; then \
						echo "$(COLOR_GREEN)✓$(COLOR_RESET) $$post_name -> $$image"; \
					else \
						echo "$(COLOR_RED)✗$(COLOR_RESET) $$post_name -> $$image (MISSING)"; \
					fi; \
				else \
					img_path="static$$image"; \
					if [ -f "$$img_path" ]; then \
						echo "$(COLOR_GREEN)✓$(COLOR_RESET) $$post_name -> $$image"; \
					else \
						echo "$(COLOR_RED)✗$(COLOR_RESET) $$post_name -> $$image (MISSING)"; \
					fi; \
				fi; \
			fi; \
		fi; \
	done

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

quick-publish: ## Quick workflow: publish a specific post and view (Usage: make quick-publish POST=filename.md)
	@$(MAKE) publish POST=$(POST)
	@$(MAKE) dev

new-and-edit: ## Create new post and start dev server
	@$(MAKE) new
	@echo "$(COLOR_GREEN)Starting development server...$(COLOR_RESET)"
	@sleep 2
	@$(MAKE) dev

