@echo off
echo ================================
echo    SPC DASHBOARD LOG VIEWER
echo ================================

:menu
echo.
echo 1. View PM2 logs (real-time)
echo 2. View status monitor logs
echo 3. View health monitor logs
echo 4. View startup logs
echo 5. View all recent logs
echo 6. Clear all logs
echo 7. Exit
echo.
set /p choice="Choose option (1-7): "

if "%choice%"=="1" goto pm2_logs
if "%choice%"=="2" goto status_logs
if "%choice%"=="3" goto health_logs
if "%choice%"=="4" goto startup_logs
if "%choice%"=="5" goto all_logs
if "%choice%"=="6" goto clear_logs
if "%choice%"=="7" goto exit
goto menu

:pm2_logs
echo.
echo === PM2 LOGS (Press Ctrl+C to stop) ===
pm2 logs SPC-Dashboard --lines 20 --follow
goto menu

:status_logs
echo.
echo === STATUS MONITOR LOGS ===
if exist status.log (
    type status.log
) else (
    echo No status logs found. Run: node status-monitor.js
)
pause
goto menu

:health_logs
echo.
echo === HEALTH MONITOR LOGS ===
if exist health-monitor.log (
    type health-monitor.log
) else (
    echo No health monitor logs found.
)
pause
goto menu

:startup_logs
echo.
echo === STARTUP LOGS ===
if exist startup.log (
    type startup.log
) else (
    echo No startup logs found.
)
pause
goto menu

:all_logs
echo.
echo === ALL RECENT LOGS ===
echo.
echo --- PM2 Status ---
pm2 list
echo.
echo --- Recent PM2 Logs ---
pm2 logs SPC-Dashboard --lines 10
echo.
echo --- Status Monitor ---
if exist status.log (
    echo Last 5 entries:
    powershell "Get-Content status.log | Select-Object -Last 5"
)
echo.
echo --- Health Monitor ---
if exist health-monitor.log (
    echo Last 5 entries:
    powershell "Get-Content health-monitor.log | Select-Object -Last 5"
)
pause
goto menu

:clear_logs
echo.
echo Clearing all log files...
del /q status.log health-monitor.log startup.log 2>nul
pm2 flush
echo Logs cleared.
pause
goto menu

:exit
echo Goodbye!
exit