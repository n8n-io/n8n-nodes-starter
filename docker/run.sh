#!/bin/sh
mkdir -p ~/.n8n/nodes/
cd ~/.n8n/nodes/
npm link n8n-nodes-<...>
/docker-entrypoint.sh
