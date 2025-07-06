#!/bin/bash
# This script builds your custom node, deploys it to your n8n custom nodes folder,
# kills any running n8n process, and then restarts n8n.
#
# It dynamically determines the target directory based on the "name" field in package.json.
#
# Usage: ./deploy-node.sh
 
# Exit immediately if a command fails.
set -e
 
##############################
# Step 0: Get Package Name
##############################
# Use Node.js to extract the package name from package.json.
PACKAGE_NAME=$(node -p "require('./package.json').name")
 
if [ -z "$PACKAGE_NAME" ]; then
  echo "Error: Could not determine package name from package.json."
  exit 1
fi
 
# Set the target directory based on the package name.
TARGET_DIR="/var/lib/docker/volumes/n8n-nodes-starter-s4ds_n8n_data/_data/custom/$PACKAGE_NAME"
 
echo "Detected package name: '$PACKAGE_NAME'"
echo "Target deployment directory: '$TARGET_DIR'"
 
##############################
# Step 1: Build the Node
##############################
echo "Building the node..."
pnpm run build
 
##############################
# Step 2: Deploy the Build Output
##############################
# Define the source (build output) directory.
SOURCE_DIR="./dist"
 
echo "Deploying build output from '$SOURCE_DIR' to '$TARGET_DIR'..."
 
# Remove any previous deployment and recreate the target directory.
sudo rm -rf "$TARGET_DIR"
sudo mkdir -p "$TARGET_DIR"
 
# Copy all files from the build output to the target directory.
sudo cp -r "$SOURCE_DIR/"* "$TARGET_DIR/"
 
echo "Deployment complete."
 
##############################
# Step 3: Restart n8n
##############################
echo "Restarting n8n..."
docker container restart n8n-nodes-starter-s4ds-n8n-1
 
# Logging for debugging
docker logs -f n8n-nodes-starter-s4ds-n8n-1