#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-app:latest}"
SEVERITY="${TRIVY_SEVERITY:-HIGH,CRITICAL}"

echo "Running Trivy security scan on: $IMAGE_NAME"

# Check if trivy is installed
if ! command -v trivy &> /dev/null; then
  echo "Trivy not found. Installing via Docker..."
  docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "$HOME/.cache/trivy:/root/.cache" \
    aquasec/trivy:latest image \
    --severity "$SEVERITY" \
    --exit-code 1 \
    "$IMAGE_NAME"
else
  trivy image \
    --severity "$SEVERITY" \
    --exit-code 1 \
    "$IMAGE_NAME"
fi
