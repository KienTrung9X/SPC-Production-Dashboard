@echo off
REM ====================================================
REM   Cấu hình Auto-Start PM2 (Windows Startup)
REM ====================================================

cls
setlocal enabledelayedexpansion

echo.
echo ====================================================
echo   PM2 Auto-Start Setup
echo ====================================================
echo.

REM Kiểm tra PM2
echo Checking PM2 installation...
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] PM2 is NOT installed!
    echo Please run "setup-pm2-server.bat" first
    echo.
    pause
    exit /b 1
)
echo [✓] PM2 is installed
echo.

REM Cài pm2-windows-startup
echo Installing pm2-windows-startup module...
call npm install -g pm2-windows-startup --force >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to install pm2-windows-startup!
    pause
    exit /b 1
)
echo [✓] pm2-windows-startup installed
echo.

REM Setup auto-start
echo Setting up auto-start in Windows...
call pm2 install pm2-windows-startup
echo.
echo ====================================================
echo   ✓ Auto-Start Setup Complete!
echo ====================================================
echo.
echo The SPC Dashboard will now start automatically when:
echo   1. Windows boots up
echo   2. The machine restarts
echo   3. PM2 daemon restarts
echo.
echo Verify in Task Scheduler: Look for "pm2-PM2" task
echo.
pause
