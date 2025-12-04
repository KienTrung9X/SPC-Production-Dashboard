@echo off
cd /d "D:\Host web app\SPC dasboard"

REM Wait for system to fully boot
timeout /t 30 /nobreak >nul

REM Start PM2 daemon
pm2 ping >nul 2>&1
if errorlevel 1 (
    pm2 kill
    timeout /t 5 /nobreak >nul
)

REM Clean and start application
pm2 delete all >nul 2>&1
pm2 start ecosystem.config.js
pm2 save

REM Start health monitor in background
start /min "Health Monitor" health-monitor.bat