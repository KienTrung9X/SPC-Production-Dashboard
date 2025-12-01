#!/bin/bash
export PATH=$HOME/bin:$PATH
export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock

echo "🚀 Khởi động SPC Dashboard..."
docker-compose up -d --build

echo "📋 Kiểm tra container..."
docker ps

echo "✅ Ứng dụng chạy tại: http://$(hostname -I | awk '{print $1}'):8080"