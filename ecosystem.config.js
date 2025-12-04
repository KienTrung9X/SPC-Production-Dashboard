module.exports = {
  apps: [
    {
      name: 'SPC-Dashboard',
      script: './simple-server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      watch: false,
      ignore_watch: ['node_modules', 'public', 'views', 'output'],
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '300M',
      autorestart: true,
      max_restarts: 50,
      min_uptime: '30s',
      restart_delay: 2000,
      kill_timeout: 3000,
      listen_timeout: 5000,
      exp_backoff_restart_delay: 100,
      merge_logs: true,
      log_type: 'json'
    }
  ]
};
