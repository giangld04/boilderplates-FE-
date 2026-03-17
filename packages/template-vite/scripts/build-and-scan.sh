#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME=$(node -p "require('./package.json').name")
IMAGE_TAG="${PROJECT_NAME}:latest"

echo "Building Docker image: $IMAGE_TAG"
docker build -t "$IMAGE_TAG" .

echo "Scanning with Trivy..."
bash "$(dirname "$0")/trivy-scan.sh" "$IMAGE_TAG"

echo "Build and scan complete: $IMAGE_TAG"
