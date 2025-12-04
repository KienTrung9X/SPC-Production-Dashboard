# Project Structure

## Directory Organization

### Root Level
- **server.js** - Main application server with full dashboard functionality
- **simple-server.js** - Simplified server version (used by npm start)
- **config.js** - Database and application configuration
- **package.json** - Node.js dependencies and project metadata

### Core Components
- **views/** - EJS templates for web interface
  - `dashboard.ejs` - Full dashboard with dual-panel layout
  - `dashboard-simple.ejs` - Simplified dashboard version
  - `data.ejs` - Data display template
  - `test.ejs` - Testing interface
- **SQLcode/** - Database query modules
  - `Production Report.js` - Production reporting queries
  - `Bin Info.js` - Bin information queries

### Deployment & Operations
- **ecosystem.config.js** - PM2 process manager configuration
- **logs/** - Application log files (error and output logs)
- **setup-*.bat** - Windows batch scripts for deployment
- **PM2-COMMANDS.bat** - PM2 management commands

### Development Support
- **jules_session/** - Development session with isolated server
- **output/** - Generated output files
- **.amazonq/rules/memory-bank/** - AI assistant memory bank

## Architectural Patterns

### Server Architecture
- **Express.js Framework**: RESTful API with EJS templating
- **ODBC Database Layer**: Direct connection to IBM DB2
- **Real-time Updates**: Polling-based refresh every 15 seconds
- **Dual Server Setup**: Main server (server.js) and simplified version (simple-server.js)

### Data Flow
1. **Database Queries**: ODBC connection to IBM DB2
2. **API Endpoints**: `/api/new_orders` and `/api/completed_status`
3. **Frontend Polling**: JavaScript auto-refresh mechanism
4. **Notification System**: Browser push notifications for new orders

### Component Relationships
- **Configuration Layer**: config.js provides database connection strings
- **Query Layer**: SQLcode modules handle database operations
- **Server Layer**: Express servers handle HTTP requests and API endpoints
- **View Layer**: EJS templates render dashboard interface
- **Process Management**: PM2 handles server lifecycle and monitoring