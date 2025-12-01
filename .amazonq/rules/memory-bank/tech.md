# SPC Production Dashboard - Technology Stack

## Programming Languages
- **JavaScript (Node.js)** - Server-side runtime (version 14.x or higher required)
- **HTML/CSS** - Frontend markup and styling
- **SQL** - Database queries for IBM DB2
- **EJS** - Embedded JavaScript templating

## Core Dependencies

### Production Dependencies
- **express (^4.18.2)** - Web application framework for Node.js
- **ejs (^3.1.9)** - Embedded JavaScript templates for server-side rendering
- **odbc (^2.4.8)** - ODBC database driver for IBM DB2 connectivity

### Development Dependencies
- **playwright (^1.57.0)** - End-to-end testing framework

## Database Technology
- **IBM DB2** - Primary database system
- **ODBC Driver** - Required for DB2 connectivity
- **Connection String Format**: DSN-based connection with authentication

## Build System
- **npm** - Package manager and build tool
- **package.json** - Dependency management and scripts

## Development Commands

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start          # Runs simple-server.js
node server.js     # Runs full-featured server
node simple-server.js  # Runs simplified server
```

### Testing
```bash
npm test           # Currently returns error - no tests specified
```

## Environment Configuration

### Required Environment Variables
- **DB_CONN_STR** - Database connection string (optional, falls back to config.js)
- **PORT** - Server port (defaults to 3000)

### Database Configuration
- **DSN**: WAVEDLIB_HN
- **Database**: Configurable via config.js
- **Authentication**: UID-based authentication
- **Connection Type**: ODBC Type 2

## Runtime Requirements
- **Node.js Runtime**: Version 14.x or higher
- **ODBC Driver**: IBM DB2 ODBC driver must be installed
- **Network Access**: Connection to IBM DB2 database server
- **Browser Support**: Modern browsers with notification API support

## Deployment Considerations
- **Port Configuration**: Configurable via environment variable
- **Database Security**: Connection credentials should use environment variables
- **Static Assets**: Served from public directory (if configured)
- **Session Management**: Basic session handling in jules_session implementation

## File Formats
- **JSON** - Configuration and data exchange
- **CSV** - Data export format
- **EJS** - Template files for server-side rendering