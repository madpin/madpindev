#!/bin/bash

###############################################################################
# Hugo Post Creator
#
# Description:
#   Creates a new Hugo blog post with proper frontmatter formatting and today's date
#
# Features:
#   - Automatically generates current date
#   - Creates file with proper Hugo frontmatter
#   - Interactive mode when no arguments provided
#   - Supports custom title and subtitle
#   - Sets default author and draft status
#   - Generates URL based on title (YYYY/MM/DD-title format)
#   - Works on both macOS and Linux
#
# Required packages:
#   - sed (usually pre-installed on macOS/Linux)
#
# Usage:
#   ./create_post.sh                     # Interactive mode
#   ./create_post.sh "Your Post Title"   # Semi-interactive mode
#   ./create_post.sh "Title" "Subtitle"  # Non-interactive mode
#
# Author: tpinto
###############################################################################

# Exit on error
set -e

# Function to read user input with a prompt
read_input() {
    local prompt="$1"
    local var_name="$2"
    local default_value="$3"
    
    # If a default value is provided, show it in the prompt
    if [ -n "$default_value" ]; then
        prompt="$prompt [$default_value]: "
    else
        prompt="$prompt: "
    fi
    
    read -p "$prompt" input
    
    # Use default value if input is empty and default exists
    if [ -z "$input" ] && [ -n "$default_value" ]; then
        input="$default_value"
    fi
    
    # Return the input through the provided variable name
    eval "$var_name=\"$input\""
}

# Get title - either from argument or user input
if [ -n "$1" ]; then
    TITLE="$1"
else
    read_input "Enter post title" TITLE
    while [ -z "$TITLE" ]; do
        echo "Title cannot be empty!"
        read_input "Enter post title" TITLE
    done
fi

# Get subtitle - either from argument or user input
if [ -n "$2" ]; then
    SUBTITLE="$2"
else
    read_input "Enter post subtitle (optional)" SUBTITLE
fi

# Set date variables
YEAR=$(date +"%Y")
MONTH=$(date +"%m")
DAY=$(date +"%d")
TODAY="${YEAR}-${MONTH}-${DAY}"

AUTHOR="Thiago MadPin"

# Convert title to URL-friendly format
# Remove special chars, convert spaces to hyphens, convert to lowercase
URL_TITLE=$(echo "$TITLE" | sed 's/[^a-zA-Z0-9 ]//g' | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
URL="/${YEAR}/${MONTH}/${DAY}-${URL_TITLE}/"

# Create posts directory if it doesn't exist
POSTS_DIR="content/post"
IMG_DIR="static/img/post"
mkdir -p "$POSTS_DIR"

# Create filename with date prefix
FILENAME="${POSTS_DIR}/${TODAY}-${URL_TITLE}.md"
IMG_FILENAME="${IMG_DIR}/${TODAY}-${URL_TITLE}.jpg"

# Create the post file
cat > "$FILENAME" << EOF
---
layout:     post 
draft:      true
title:      "${TITLE}"
$([ -n "$SUBTITLE" ] && echo "subtitle:   \"${SUBTITLE}\"")
date:       ${TODAY}
author:     "${AUTHOR}"
URL:        "${URL}"
image:      "${IMG_FILENAME}"
categories: [ Tech ]
tags:
    - 
---

Write your post content here...
EOF

echo "Created new post: $FILENAME"
