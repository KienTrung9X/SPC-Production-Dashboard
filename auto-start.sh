#!/bin/bash
echo "⚙️ Cài đặt auto-start sau khi restart máy..."

mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/spc-dashboard.service << EOF
[Unit]
Description=SPC Dashboard
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PWD
ExecStart=$HOME/bin/docker-compose up -d
ExecStop=$HOME/bin/docker-compose down

[Install]
WantedBy=default.target
EOF

systemctl --user enable spc-dashboard.service
systemctl --user start spc-dashboard.service

echo "✅ Auto-start đã được cài đặt! Ứng dụng sẽ tự động chạy sau khi restart máy"