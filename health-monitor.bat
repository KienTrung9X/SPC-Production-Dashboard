@echo off
:monitor_loop
timeout /t 30 /nobreak >nul

REM Check if app is running
pm2 jlist | findstr "SPC-Dashboard" | findstr "online" >nul
if errorlevel 1 (
    echo [%date% %time%] ALERT: SPC Dashboard is DOWN! >> health-monitor.log
    
    echo [%date% %time%] ALERT: SPC Dashboard is DOWN! >> health-monitor.log
    
    REM Try to restart
    pm2 restart SPC-Dashboard
    echo [%date% %time%] Attempted restart >> health-monitor.log
) else (
    echo [%date% %time%] SPC Dashboard is running normally >> health-monitor.log
)

goto monitor_loop