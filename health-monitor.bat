@echo off
REM Health monitoring script for SPC Dashboard

:MONITOR
timeout /t 60 /nobreak >nul

REM Check if PM2 process is running
pm2 list | findstr "online" >nul
if errorlevel 1 (
    echo [%date% %time%] PM2 process not online, restarting...
    pm2 restart SPC-Dashboard
    timeout /t 10 /nobreak >nul
)

REM Check HTTP response
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 10; if($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo [%date% %time%] App not responding, restarting...
    pm2 restart SPC-Dashboard
    timeout /t 15 /nobreak >nul
)

goto MONITOR