@echo off
echo ====================================================
echo   SPC Dashboard Status Check
echo ====================================================
echo.

echo [PM2 Process Status]
pm2 list
echo.

echo [Application URL Test]
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 5; Write-Host 'HTTP Status:' $response.StatusCode -ForegroundColor Green } catch { Write-Host 'Application NOT responding' -ForegroundColor Red }"
echo.

echo [Network Access Test]
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://10.247.199.210:3001' -TimeoutSec 5; Write-Host 'Network Status:' $response.StatusCode -ForegroundColor Green } catch { Write-Host 'Network access FAILED' -ForegroundColor Red }"
echo.

echo [Startup Log (Last 10 lines)]
if exist startup.log (
    powershell -Command "Get-Content startup.log | Select-Object -Last 10"
) else (
    echo No startup log found
)
echo.

echo [System Uptime]
powershell -Command "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime | Select-Object Days, Hours, Minutes"

pause