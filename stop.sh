#!/bin/bash
export PATH=$HOME/bin:$PATH
export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock

echo "⏹️ Dừng SPC Dashboard..."
docker-compose down

echo "✅ Ứng dụng đã dừng"