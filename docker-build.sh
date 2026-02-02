#!/bin/bash

# Script to build Docker image with environment variables from .env file

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with the required environment variables."
    exit 1
fi

# Source the .env file to load variables
set -a
source .env
set +a

# Build the Docker image with build arguments
# Note: Only NEXT_PUBLIC_ variables need to be build args (they're embedded at build time)
# FRAPPE_CLIENT_ID and FRAPPE_CLIENT_SECRET are passed at runtime via --env-file
docker build \
  --build-arg NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
  --build-arg NEXT_PUBLIC_BACKEND="$NEXT_PUBLIC_BACKEND" \
  --build-arg NEXT_PUBLIC_SOCKET_URL="$NEXT_PUBLIC_SOCKET_URL" \
  -t lms-frontend .

echo "Build complete! Run with: docker run -p 3000:3000 --env-file .env lms-frontend"

