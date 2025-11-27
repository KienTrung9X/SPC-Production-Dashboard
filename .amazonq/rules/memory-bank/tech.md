# Technology Stack

## Programming Languages
- **JavaScript (Node.js)**: Primary development language for server-side logic
- **EJS**: Template engine for dynamic HTML generation
- **HTML/CSS**: Frontend presentation layer
- **SQL**: Database query language for IBM DB2

## Core Dependencies

### Database Connectivity
- **ibm_db** (^3.3.4): Native IBM DB2 driver for Node.js
- **odbc** (^2.4.8-2.4.9): Generic ODBC connectivity for database access

### Web Framework
- **express** (^4.18.2): Web application framework for Node.js
- **ejs** (^3.1.9): Embedded JavaScript templating engine

### Development Tools
- **playwright** (^1.57.0): Browser automation for testing (dev dependency)

## Database Technology
- **IBM DB2**: Primary database system
- **ODBC**: Database connectivity protocol
- **Provider**: IBMDA400.DataSource for AS/400 systems

## Build System and Scripts

### Root Project Scripts
```json
{
  "start": "node app.js",
  "all": "node run-all-queries.js"
}
```

### Jules Session Scripts
```json
{
  "start": "node simple-server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## Development Commands

### Installation
```bash
npm install                    # Install all dependencies
```

### Running the Application
```bash
npm start                      # Start main application
node run-odbc.js              # Run ODBC queries directly
node jules_session/server.js  # Start web dashboard
```

### Database Operations
```bash
node run-all-queries.js       # Execute all configured queries
```

## Environment Requirements

### System Prerequisites
- **Node.js**: Version 14.x or higher
- **npm**: Package manager (included with Node.js)
- **ODBC Driver**: IBM DB2 ODBC driver for database connectivity

### Network Configuration
- **Database Host**: 10.247.194.1
- **Database**: WAVEDLIB
- **Web Server**: localhost:3000 (default)

## Configuration Management

### Database Configuration
```javascript
{
  provider: "IBMDA400.DataSource",
  hostname: "10.247.194.1",
  database: "WAVEDLIB",
  uid: "FA01001",
  pwd: "FA01001"
}
```

### Application Parameters
- **Date Range**: Configurable start/end dates (YYYYMMDD format)
- **Line Codes**: Production line identifiers (315, 312, 311)
- **Row Limits**: Query result limitations (up to 10,000,000 records)

## Development Workflow

### Local Development
1. Install Node.js and npm
2. Clone/download project repository
3. Run `npm install` in both root and jules_session directories
4. Configure database connection parameters
5. Start application with `npm start`

### Database Connection Testing
1. Verify ODBC driver installation
2. Test connection with run-odbc.js
3. Validate query execution and results

### Web Interface Development
1. Start Express server in jules_session directory
2. Access dashboard at http://localhost:3000
3. Test real-time updates and notifications

## Performance Considerations
- **Query Limits**: Configurable row limits to prevent memory issues
- **Polling Intervals**: 15-second refresh rate for real-time updates
- **Connection Pooling**: ODBC connection management for efficiency
- **CSV Export**: Large dataset handling for report generation