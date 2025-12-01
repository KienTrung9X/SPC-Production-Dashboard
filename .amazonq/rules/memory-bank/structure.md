# SPC Production Dashboard - Project Structure

## Directory Organization

### Root Level
- **server.js** - Main application server with full dashboard functionality
- **simple-server.js** - Simplified server implementation (used as npm start entry point)
- **config.js** - Database connection configuration
- **run-odbc.js** - ODBC connection utilities and testing
- **export-production.js** - Production data export functionality
- **package.json** - Node.js dependencies and project metadata

### Core Directories

#### `/views/` - EJS Templates
- **dashboard.ejs** - Main production dashboard interface
- **dashboard-simple.ejs** - Simplified dashboard layout
- **data.ejs** - Data display template
- **test.ejs** - Testing interface
- **simple-test.ejs** - Basic test template

#### `/SQLcode/` - Database Queries
- **Bin Info.js** - TRZ50 bin information queries
- **Production Report.js** - Complex production reporting queries

#### `/jules_session/` - Alternative Implementation
- Complete alternate server setup with own package.json and views
- **server.js** - Session-based server implementation
- **views/index.ejs** - Session dashboard template

#### `/output/` - Generated Files
- Directory for exported data and generated reports

## Core Components

### Database Layer
- **ODBC Connection**: Direct connection to IBM DB2 using odbc package
- **Query Modules**: Separated SQL queries in dedicated files for maintainability
- **Connection String**: Configurable DB2 connection with environment variable support

### Web Server Layer
- **Express.js Framework**: RESTful API endpoints and static file serving
- **EJS Templating**: Server-side rendering for dashboard views
- **Static Assets**: CSS, JavaScript, and icon files served from public directory

### API Endpoints
- **GET /api/trz50** - Bin information data
- **GET /api/production** - Production report data
- **GET /api/export/:type** - CSV export functionality
- **GET /** - Dashboard rendering routes

## Architectural Patterns

### MVC Architecture
- **Models**: Database queries in SQLcode directory
- **Views**: EJS templates in views directory
- **Controllers**: Route handlers in server files

### Separation of Concerns
- Configuration isolated in config.js
- Database queries modularized in separate files
- Multiple server implementations for different use cases

### Real-time Updates
- Client-side polling every 15 seconds
- Browser notification API integration
- Automatic data refresh without page reload

## Component Relationships
```
server.js
├── config.js (database configuration)
├── SQLcode/
│   ├── Bin Info.js (TRZ50 queries)
│   └── Production Report.js (production queries)
└── views/
    ├── dashboard.ejs (main interface)
    └── other templates
```