# Technology Stack

## Programming Languages
- **JavaScript (Node.js)**: Primary development language
- **SQL**: Database queries for IBM DB2
- **EJS**: Template engine for web views
- **Markdown**: Documentation format

## Core Dependencies

### Database Connectivity
- **ibm_db (^3.3.4)**: IBM DB2 database driver
  - Native DB2 connectivity
  - SQL query execution
  - Connection pooling support

### Web Framework (jules_session)
- **Express.js**: Web server framework
- **EJS**: Embedded JavaScript templates
- **Static file serving**: CSS, JS, images

## Database Technology
- **IBM DB2**: Enterprise database system
- **WAVEDLIB**: Primary database schema
- **IBMDA400.DataSource**: Connection provider
- **AS/400 Integration**: Legacy system connectivity

## Development Tools

### Package Management
- **npm**: Node.js package manager
- **package-lock.json**: Dependency version locking

### Scripts
- `npm start`: Run main application (app.js)
- `npm run all`: Execute all queries (run-all-queries.js)

### File Organization
- **CommonJS Modules**: require/module.exports pattern
- **Template Literals**: Dynamic SQL generation
- **Configuration Objects**: Centralized settings

## Development Commands

### Query Execution
```bash
node run-query.js trz50                    # TRZ50 query
node run-query.js productionReport         # Simple production report
node run-query.js productionReportFull     # Complex production report
```

### Web Interface
```bash
cd jules_session
npm start                                  # Start web server
```

### Batch Processing
```bash
node run-all-queries.js                    # Execute all queries
```

## Environment Requirements
- **Node.js**: Runtime environment
- **IBM DB2 Client**: Database connectivity
- **Windows**: Primary development platform
- **Network Access**: DB2 server connectivity (10.247.194.1)