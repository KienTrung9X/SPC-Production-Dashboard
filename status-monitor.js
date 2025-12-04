// Status Monitor - Hiển thị log trạng thái app
const { exec } = require('child_process');
const fs = require('fs');

function getCurrentTime() {
    return new Date().toLocaleString('vi-VN');
}

function logStatus(status, message) {
    const logEntry = `[${getCurrentTime()}] ${status}: ${message}\n`;
    console.log(logEntry.trim());
    fs.appendFileSync('status.log', logEntry);
}

function checkAppStatus() {
    exec('pm2 jlist', (error, stdout, stderr) => {
        if (error) {
            logStatus('ERROR', `Cannot check PM2 status: ${error.message}`);
            return;
        }

        try {
            const processes = JSON.parse(stdout);
            const spcApp = processes.find(p => p.name === 'SPC-Dashboard');
            
            if (!spcApp) {
                logStatus('NOT_FOUND', 'SPC-Dashboard process not found');
                return;
            }

            const status = spcApp.pm2_env.status;
            const uptime = spcApp.pm2_env.pm_uptime;
            const restarts = spcApp.pm2_env.restart_time;
            const memory = Math.round(spcApp.monit.memory / 1024 / 1024);
            const cpu = spcApp.monit.cpu;

            const uptimeStr = uptime ? Math.round((Date.now() - uptime) / 1000 / 60) : 0;
            
            logStatus('STATUS', `${status.toUpperCase()} | Uptime: ${uptimeStr}m | Restarts: ${restarts} | Memory: ${memory}MB | CPU: ${cpu}%`);
            
        } catch (parseError) {
            logStatus('ERROR', `Cannot parse PM2 output: ${parseError.message}`);
        }
    });
}

function showRecentLogs() {
    console.log('\n=== RECENT STATUS LOGS ===');
    if (fs.existsSync('status.log')) {
        const logs = fs.readFileSync('status.log', 'utf8').split('\n').slice(-10);
        logs.forEach(log => {
            if (log.trim()) console.log(log);
        });
    }
    console.log('========================\n');
}

// Main execution
console.log('SPC Dashboard Status Monitor');
console.log('============================');

// Show recent logs first
showRecentLogs();

// Check status immediately
checkAppStatus();

// Check every 30 seconds
setInterval(checkAppStatus, 30000);

console.log('Monitoring started. Press Ctrl+C to stop.');