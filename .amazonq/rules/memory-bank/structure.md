# Project Structure

## Directory Organization

### Root Level
- **app.js** / **app-production.js**: Main application entry points
- **config.js**: Centralized configuration management
- **package.json**: Node.js dependencies and scripts
- **run-*.js**: Query execution utilities
- **HUONG_DAN.md**: Vietnamese configuration guide

### Core Modules
- **SQLcode/**: SQL query definitions
  - `Production Report.js`: Complex production reporting queries
  - `Bin Info.js`: Bin information queries
- **jules_session/**: Web interface module
  - `server.js`: Express.js web server
  - `views/index.ejs`: EJS template
  - `package.json`: Separate dependency management
- **output/**: Generated reports and data files
- **.amazonq/rules/memory-bank/**: Documentation and guidelines

## Component Relationships

### Configuration Layer
- **config.js**: Central configuration hub
  - Database connection parameters
  - Query parameters (dates, line codes, limits)
  - Used by all query modules

### Data Access Layer
- **SQLcode/**: Query definitions using config parameters
- **run-query.js**: Query execution engine
- **ibm_db**: Database connectivity driver

### Application Layer
- **app.js**: Command-line interface
- **jules_session/server.js**: Web interface
- **run-all-queries.js**: Batch processing

### Output Layer
- **output/**: File-based results
- Console output for immediate feedback

## Architectural Patterns

### Configuration-Driven Design
All queries use centralized config.js for parameters, enabling easy customization without code changes.

### Modular Query Organization
SQL queries are separated into logical modules (Production Report, Bin Info) for maintainability.

### Dual Interface Support
Both command-line and web interfaces for different user preferences and automation needs.

### Template-Based SQL
SQL queries use JavaScript template literals with config parameters for dynamic query generation.