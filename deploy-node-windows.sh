#!/bin/bash

# Exit immediately if a command fails.
set -e

##############################
# Step 0: Get Package Name
##############################
PACKAGE_NAME=$(node -p "require('./package.json').name")

if [ -z "$PACKAGE_NAME" ]; then
  echo "❌ Error: Could not determine package name from package.json."
  exit 1
fi

echo "📦 Detected package name: '$PACKAGE_NAME'"

##############################
# Step 1: Build the Node
##############################
echo "🔨 Building the node..."
pnpm run build

##############################
# Step 2: Deploy the Build Output
##############################
SOURCE_DIR="D:\\Users\\aleja\\Code\\n8n-nodes-starter-s4ds\\dist"

echo "🚀 Deploying build output from '$SOURCE_DIR' to Docker volume..."

docker run --rm \
  -v n8n-nodes-starter-s4ds_n8n_data:/data \
  -v "${SOURCE_DIR}:/build" \
  alpine sh -c "mkdir -p /data/custom/$PACKAGE_NAME && cp -r /build/* /data/custom/$PACKAGE_NAME/"

echo "✅ Deployment complete."

##############################
# Step 3: Restart n8n
##############################
echo "♻️ Restarting n8n container..."
docker container restart n8n-nodes-starter-s4ds-n8n-1

echo "📄 Streaming logs..."
docker logs -f n8n-nodes-starter-s4ds-n8n-1
