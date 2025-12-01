📋 HƯỚNG DẪN CÀI ĐẶT PM2 TRÊN SERVER 10.247.199.210
═════════════════════════════════════════════════════

✅ TẠO SẰN CÁC FILE (xem thư mục hiện tại):
   ✓ ecosystem.config.js       - Cấu hình PM2
   ✓ setup-pm2-server.bat      - Script setup PM2
   ✓ setup-autostart.bat       - Script auto-start
   ✓ PM2-COMMANDS.bat          - Danh sách lệnh
   ✓ HUONG_DAN_PM2_SERVER.md   - Hướng dẫn chi tiết
   ✓ logs/                     - Thư mục logs

═════════════════════════════════════════════════════

📝 CÁC BƯỚC THỰC HIỆN TRÊN SERVER:

BƯỚC 1: Mở Command Prompt (WIN + R → cmd)

BƯỚC 2: Di chuyển tới thư mục dự án:
   cd /d k:\Host web app\SPC dasboard

BƯỚC 3: Chạy script setup:
   setup-pm2-server.bat
   
   (Script sẽ tự động:
    - Cài dependencies
    - Cài PM2
    - Khởi động server)

BƯỚC 4: Cấu hình auto-start (Optional):
   setup-autostart.bat
   
   (Server sẽ tự động khởi động khi máy restart)

═════════════════════════════════════════════════════

✅ XONG! Server sẽ:
   • Chạy ẩn (không hiển thị terminal)
   • Tự động khởi động khi máy restart
   • Tự động restart nếu crash
   • Lưu logs vào thư mục logs/

═════════════════════════════════════════════════════

🌐 Truy cập:
   Local:   http://localhost:3001
   Remote:  http://10.247.199.210:3001

═════════════════════════════════════════════════════

📊 Kiểm tra sau khi cài:
   pm2 status              - Xem trạng thái
   pm2 logs SPC-Dashboard  - Xem logs
   pm2 monit               - Giám sát

═════════════════════════════════════════════════════

❓ CÓ LỖIX?
   1. Kiểm tra logs: pm2 logs SPC-Dashboard
   2. Xem status: pm2 status
   3. Reset: pm2 flush && pm2 restart SPC-Dashboard

═════════════════════════════════════════════════════
