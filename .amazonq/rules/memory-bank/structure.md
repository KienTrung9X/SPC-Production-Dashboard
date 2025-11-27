# Project Structure

## Directory Organization

### Root Level
```
SPC-Production-Dashboard/
├── config.js              # Central configuration for database and parameters
├── package.json           # Main project dependencies (ibm_db, odbc)
├── run-odbc.js            # Primary ODBC connection and query execution
└── .gitignore             # Version control exclusions
```

### Jules Session Module
```
jules_session/
├── server.js              # Main Express server with dashboard routes
├── simple-server.js       # Simplified server implementation
├── package.json           # Web server dependencies (express, ejs, odbc)
├── README.md             # Vietnamese documentation and setup guide
└── views/
    ├── dashboard.ejs      # Main dashboard template
    └── data.ejs          # Data display template
```

### SQL Code Module
```
SQLcode/
├── Production Report.js   # Production reporting queries and logic
└── Bin Info.js           # Bin information tracking queries
```

### Output Directory
```
output/
├── trz50_20251126_092349.csv  # Generated production reports
└── trz50_20251126_092438.csv  # Timestamped export files
```

## Core Components

### Configuration Layer
- **config.js**: Centralized configuration management
  - Database connection parameters (hostname, credentials)
  - Date range settings (startDate, endDate)
  - Production line codes (315, 312, 311)
  - Query limits and performance tuning

### Database Access Layer
- **run-odbc.js**: Primary database interface
  - ODBC connection management
  - Query execution and result processing
  - Error handling and connection pooling

### Web Application Layer
- **jules_session/server.js**: Express.js web server
  - RESTful API endpoints (/api/new_orders, /api/completed_status)
  - Real-time data polling and updates
  - Browser notification integration

### Query Processing Layer
- **SQLcode/**: Specialized query modules
  - Production Report.js: Manufacturing data queries
  - Bin Info.js: Inventory and bin tracking queries

### Template Layer
- **views/**: EJS template system
  - dashboard.ejs: Main production dashboard interface
  - data.ejs: Data visualization components

## Architectural Patterns

### Multi-Tier Architecture
1. **Presentation Tier**: Web browser with real-time updates
2. **Application Tier**: Node.js Express server with business logic
3. **Data Tier**: IBM DB2 database with ODBC connectivity

### Configuration-Driven Design
- Centralized configuration in config.js
- Environment-specific settings
- Parameterized queries and connection strings

### Modular Query System
- Separate modules for different data types
- Reusable query components
- Specialized reporting functions

### Real-Time Data Flow
- Polling-based updates (15-second intervals)
- Browser notification system
- Automatic data refresh without page reload

## Component Relationships

### Data Flow
1. **config.js** → Provides connection and query parameters
2. **run-odbc.js** → Executes database queries using config
3. **SQLcode/** → Contains specialized query logic
4. **server.js** → Serves web interface and API endpoints
5. **views/** → Renders data in browser-friendly format

### Dependency Structure
- Root package.json: Database connectivity (ibm_db, odbc)
- Jules session package.json: Web framework (express, ejs)
- Shared configuration across all modules
- Independent query modules with specific responsibilities