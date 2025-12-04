@echo off
cd /d "D:\Host web app\SPC dasboard"

REM Create startup log
echo [%date% %time%] Starting SPC Dashboard auto-startup >> startup.log

REM Wait for system to fully boot
echo [%date% %time%] Waiting for system boot... >> startup.log
timeout /t 30 /nobreak >nul

REM Start PM2 daemon
echo [%date% %time%] Starting PM2 daemon... >> startup.log
pm2 ping >nul 2>&1
if errorlevel 1 (
    pm2 kill
    timeout /t 5 /nobreak >nul
)

REM Clean and start application
echo [%date% %time%] Starting SPC Dashboard application... >> startup.log
pm2 delete all >nul 2>&1
pm2 start ecosystem.config.js
pm2 save

REM Verify startup
pm2 list >> startup.log
echo [%date% %time%] SPC Dashboard startup completed >> startup.log

REM Start health monitor in background
start /min "Health Monitor" health-monitor.bat