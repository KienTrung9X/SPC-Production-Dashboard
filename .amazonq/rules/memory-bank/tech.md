# Technology Stack

## Programming Languages
- **JavaScript (Node.js)** - Server-side runtime environment
- **HTML/CSS** - Frontend markup and styling within EJS templates
- **SQL** - Database queries for IBM DB2
- **Batch Scripts** - Windows deployment automation

## Core Dependencies
- **express (^4.18.2)** - Web application framework
- **ejs (^3.1.9)** - Embedded JavaScript templating engine
- **odbc (^2.4.8)** - Database connectivity for IBM DB2

## Development Dependencies
- **playwright (^1.57.0)** - Browser automation for testing

## Database Technology
- **IBM DB2** - Enterprise database system
- **ODBC Driver** - Database connectivity layer

## Process Management
- **PM2** - Production process manager for Node.js applications
- **Windows Services** - System-level service integration

## Development Commands

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start          # Runs simple-server.js
node server.js     # Runs full server with complete dashboard
node simple-server.js  # Runs simplified version
```

### PM2 Process Management
```bash
pm2 start ecosystem.config.js  # Start with PM2 configuration
pm2 resurrect                  # Restore saved PM2 processes
pm2 list                       # Show running processes
pm2 logs                       # View application logs
```

## System Requirements
- **Node.js**: Version 14.x or higher
- **npm**: Package manager (included with Node.js)
- **ODBC Driver**: IBM DB2 ODBC driver
- **Windows OS**: Batch scripts designed for Windows environment

## Configuration
- **Environment Variables**: DB_CONN_STR for database connection
- **Port Configuration**: Default port 3000 (configurable)
- **Database Connection**: ODBC connection string in config.js