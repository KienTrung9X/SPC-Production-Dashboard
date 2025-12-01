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
      max_memory_restart: '500M',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000
    }
  ]
};
