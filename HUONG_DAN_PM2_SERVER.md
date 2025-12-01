# 📋 HƯỚNG DẪN CÀI ĐẶT PM2 TRÊN SERVER

## ⚠️ LƯU Ý QUAN TRỌNG
- **IP Server:** 10.247.199.210
- **Port:** 3001
- **Đường dẫn dự án:** Tương tự như máy local

---

## 📝 CÁC BƯỚC THỰC HIỆN

### **BƯỚC 1: Mở Command Prompt (CMD) trên Server**

1. Nhấn `Win + R`
2. Gõ `cmd` rồi Enter
3. Hoặc mở PowerShell và gõ `cmd.exe`

---

### **BƯỚC 2: Di chuyển tới thư mục dự án**

```bash
cd /d k:\Host web app\SPC dasboard
```

**Giải thích:**
- `cd` = Change Directory (thay đổi thư mục)
- `/d` = Cho phép thay đổi ổ đĩa (từ C: sang K:)
- Đường dẫn phải chính xác, có dấu cách

---

### **BƯỚC 3: Kiểm tra Node.js & npm đã cài chưa**

```bash
node --version
npm --version
```

**Nếu lỗi "command not found":**
- Cài Node.js từ https://nodejs.org/ (LTS version)
- Restart máy sau khi cài
- Thử lại các lệnh trên

---

### **BƯỚC 4: Cài đặt dependencies**

```bash
npm install
```

**Chờ cho tới khi có dòng:**
```
added XX packages in XXs
```

---

### **BƯỚC 5: Cài PM2 global**

```bash
npm install -g pm2
```

**Hoặc nếu lỗi permission, dùng:**
```bash
npm install -g pm2 --force
```

**Kiểm tra cài đặt:**
```bash
pm2 --version
```

---

### **BƯỚC 6: Tạo file cấu hình PM2**

Tạo file `ecosystem.config.js` trong thư mục dự án với nội dung:

```javascript
module.exports = {
  apps: [
    {
      name: 'SPC-Dashboard',
      script: './simple-server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      watch: false,
      ignore_watch: ['node_modules', 'public', 'views', 'output'],
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '500M',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000
    }
  ]
};
```

---

### **BƯỚC 7: Tạo thư mục logs**

```bash
mkdir logs
```

---

### **BƯỚC 8: Khởi động ứng dụng với PM2**

```bash
pm2 start ecosystem.config.js
```

**Kết quả sẽ hiển thị:**
```
[PM2] App [SPC-Dashboard] launched (1 instances)
```

---

### **BƯỚC 9: Kiểm tra trạng thái**

```bash
pm2 status
```

**Xem logs real-time:**
```bash
pm2 logs SPC-Dashboard
```

---

### **BƯỚC 10: Cấu hình khởi động tự động (Windows Startup)**

**Cách 1: Dùng PM2 (Recommended)**
```bash
pm2 install pm2-windows-startup
```

**Cách 2: Dùng Task Scheduler (Manual)**
1. Mở `Task Scheduler`
2. Tạo Basic Task mới
3. Tên: "SPC-Dashboard"
4. Trigger: "At startup"
5. Action: Start a program
   - Program: `cmd.exe`
   - Arguments: `/c cd /d k:\Host web app\SPC dasboard && pm2 start ecosystem.config.js`

---

## ✅ XONG! Server đã sẵn sàng

**Truy cập:** 
- Local: `http://localhost:3001`
- Remote: `http://10.247.199.210:3001`

---

## 📊 CÁC LỆNH THƯỜNG DÙNG

| Lệnh | Mục đích |
|------|---------|
| `pm2 status` | Xem trạng thái |
| `pm2 logs SPC-Dashboard` | Xem logs real-time |
| `pm2 stop SPC-Dashboard` | Dừng server |
| `pm2 restart SPC-Dashboard` | Khởi động lại |
| `pm2 delete SPC-Dashboard` | Xóa khỏi PM2 |
| `pm2 monit` | Giám sát CPU & Memory |
| `pm2 kill` | Dừng PM2 daemon |

---

## 🔧 KHẮC PHỤC SỰ CỐ

### **Server không khởi động:**
```bash
pm2 logs SPC-Dashboard
```
Xem chi tiết lỗi trong logs

### **Port 3001 đang bị dùng:**
Sửa file `ecosystem.config.js`, thay đổi PORT:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3002  // Đổi sang port khác
}
```

### **Reset PM2:**
```bash
pm2 flush
pm2 restart all
```

### **Xóa hoàn toàn PM2:**
```bash
pm2 kill
npm uninstall -g pm2
```

---

## 🎯 TỔNG KẾT

1. ✅ Mở CMD, di chuyển tới thư mục dự án
2. ✅ `npm install` - Cài dependencies
3. ✅ `npm install -g pm2` - Cài PM2
4. ✅ Tạo `ecosystem.config.js`
5. ✅ `mkdir logs` - Tạo thư mục logs
6. ✅ `pm2 start ecosystem.config.js` - Khởi động
7. ✅ `pm2 install pm2-windows-startup` - Setup auto-start
8. ✅ Restart máy hoặc chạy `pm2 start ecosystem.config.js` lại

**Server sẽ chạy ẩn mà không hiển thị terminal, và tự động khởi động khi máy restart!**

---

## 📞 Liên hệ hỗ trợ

Nếu gặp vấn đề, cung cấp thông tin:
- Output của `pm2 logs SPC-Dashboard`
- Output của `pm2 status`
- Đúng đường dẫn thư mục
