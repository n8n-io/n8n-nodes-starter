#!/bin/bash
set -e

set -x

N8N_NODES_DIR=~/.n8n/custom

# Build the node
npm install
npm run lint
npm run build
npm link
package_name="$(npm run getPackageName -s)"

mkdir -p "${N8N_NODES_DIR}"
cd "${N8N_NODES_DIR}"

# Link the custom node into n8n
npm link "${package_name}"

# Start the server
n8n
