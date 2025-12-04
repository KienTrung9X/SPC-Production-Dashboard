@echo off
REM Health check and auto-restart script

:CHECK
timeout /t 30 /nobreak >nul
curl -s http://localhost:3001 >nul 2>&1
if errorlevel 1 (
    echo [%date% %time%] App not responding, restarting...
    pm2 restart SPC-Dashboard
)
goto CHECK