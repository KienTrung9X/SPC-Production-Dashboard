#!/bin/bash
echo "=== Cài đặt Docker rootless ==="
curl -fsSL https://get.docker.com/rootless | sh
echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
echo 'export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock' >> ~/.bashrc
source ~/.bashrc
systemctl --user enable docker
loginctl enable-linger $(whoami)

echo "=== Tạo Dockerfile ==="
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p output
EXPOSE 8080
CMD ["npm", "start"]
EOF

echo "=== Tạo docker-compose.yml ==="
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  spc-dashboard:
    build: .
    ports:
      - "8080:8080"
    restart: unless-stopped
    volumes:
      - ./output:/app/output
EOF

echo "✅ Setup hoàn tất! Chạy ./start.sh để khởi động ứng dụng"