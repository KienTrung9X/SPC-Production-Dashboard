@echo off
REM ====================================================
REM   SCRIPT CÀI ĐẶT PM2 CHO SPC DASHBOARD - SERVER
REM ====================================================
REM   Chạy script này trên server (10.247.199.210)
REM   Đảm bảo Node.js đã cài đặt trước
REM ====================================================

cls
setlocal enabledelayedexpansion

echo.
echo ====================================================
echo   SPC Dashboard - PM2 Setup Script
echo ====================================================
echo.

REM Kiểm tra Node.js
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is NOT installed!
    echo Please install Node.js from: https://nodejs.org/
    echo After installation, restart this machine and run this script again.
    echo.
    pause
    exit /b 1
)
echo [✓] Node.js is installed: %NODE_VERSION%
echo.

REM Kiểm tra npm
echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is NOT installed!
    pause
    exit /b 1
)
echo [✓] npm is installed
echo.

REM Cài dependencies
echo [3/5] Installing project dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [✓] Dependencies installed successfully
echo.

REM Cài PM2 global
echo [4/5] Installing PM2 globally...
call npm install -g pm2 --force >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to install PM2!
    pause
    exit /b 1
)
echo [✓] PM2 installed successfully
echo.

REM Tạo thư mục logs
echo [5/5] Creating logs directory...
if not exist logs mkdir logs
echo [✓] Logs directory created
echo.

REM Khởi động PM2
echo ====================================================
echo   Starting SPC Dashboard with PM2...
echo ====================================================
echo.
call pm2 start ecosystem.config.js
echo.
echo ====================================================
echo   ✓ Setup Complete!
echo ====================================================
echo.
echo Dashboard URL: http://10.247.199.210:3001
echo.
echo Next steps:
echo   1. Setup auto-start: run "setup-autostart.bat"
echo   2. View status: pm2 status
echo   3. View logs: pm2 logs SPC-Dashboard
echo   4. Restart server: pm2 restart SPC-Dashboard
echo.
pause
