@echo off
REM ====================================================
REM   PM2 Commands Cheat Sheet
REM ====================================================
REM   Copy & paste các lệnh dưới đây vào Command Prompt
REM ====================================================

REM Chạy tất cả lệnh này từ thư mục dự án:
REM cd /d k:\Host web app\SPC dasboard

echo.
echo ====================================================
echo   PM2 COMMANDS CHEAT SHEET
echo ====================================================
echo.
echo [1] Xem trạng thái:
echo     pm2 status
echo.
echo [2] Xem logs real-time:
echo     pm2 logs SPC-Dashboard
echo.
echo [3] Dừng server:
echo     pm2 stop SPC-Dashboard
echo.
echo [4] Khởi động lại:
echo     pm2 restart SPC-Dashboard
echo.
echo [5] Xem CPU & Memory:
echo     pm2 monit
echo.
echo [6] Xóa khỏi PM2:
echo     pm2 delete SPC-Dashboard
echo.
echo [7] Khởi động lại tất cả:
echo     pm2 start ecosystem.config.js
echo.
echo [8] Reset logs:
echo     pm2 flush
echo.
echo [9] Dừng tất cả PM2:
echo     pm2 kill
echo.
echo ====================================================
echo   THƯỜNG DÙNG
echo ====================================================
echo.
echo View status:
echo     pm2 status
echo.
echo Restart:
echo     pm2 restart SPC-Dashboard
echo.
echo View logs (100 lines):
echo     pm2 logs SPC-Dashboard --lines 100
echo.
echo ====================================================
echo.
pause
