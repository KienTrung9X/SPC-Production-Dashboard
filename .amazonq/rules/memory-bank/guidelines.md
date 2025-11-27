# Development Guidelines

## Code Quality Standards

### File Organization and Structure
- **Modular Architecture**: Separate concerns into distinct modules (SQLcode/, jules_session/, config.js)
- **Configuration Centralization**: Use single config.js file for all database and application parameters
- **Query Separation**: Keep SQL queries in dedicated modules (Production Report.js, Bin Info.js)
- **Output Management**: Dedicated output/ directory for generated files with timestamp naming

### Naming Conventions
- **Files**: Use descriptive names with spaces for SQL modules ("Production Report.js", "Bin Info.js")
- **Variables**: Use camelCase for JavaScript variables (startDate, endDate, lineCode, rowLimit)
- **Constants**: Use descriptive object keys in config (hostname, database, uid, pwd)
- **API Endpoints**: Use RESTful patterns (/api/dashboard/stats, /api/trz50, /api/production)

### Code Formatting Patterns
- **SQL Queries**: Multi-line format with consistent indentation and .replace(/\\n\\s+/g, ' ').trim() for cleanup
- **Comments**: Use decorative comment blocks with Unicode characters (═══, ───) for section separation
- **Error Handling**: Consistent try-catch blocks with descriptive Vietnamese error messages
- **Function Structure**: Async/await pattern for database operations with proper connection cleanup

## Semantic Patterns Overview

### Database Connection Management (5/5 files)
```javascript
const connStr = `DRIVER={IBM i Access ODBC Driver};SYSTEM=${config.hostname};UID=${config.uid};PWD=${config.pwd};DBQ=WAVEDLIB;`;

async function executeQuery(sql, params) {
    const connection = await odbc.connect(connStr);
    try {
        return await connection.query(sql, params);
    } finally {
        await connection.close();
    }
}
```

### Parameterized Query Pattern (4/5 files)
- **Security First**: All SQL queries use parameterized inputs to prevent injection
- **Parameter Arrays**: Consistent parameter passing with array format
- **Date Formatting**: Automatic conversion from YYYY-MM-DD to YYYYMMDD format
- **Default Fallbacks**: Use config values when parameters not provided

### Configuration-Driven Development (5/5 files)
```javascript
const config = require('./config');
// or
const config = require('../config');

// Usage with fallbacks
const params = [
    lineCode || config.lineCode,
    startDate ? startDate.replace(/-/g, '') : config.startDate,
    endDate ? endDate.replace(/-/g, '') : config.endDate,
    parseInt(rowLimit || config.rowLimit, 10)
];
```

### Error Handling Standards (4/5 files)
- **Vietnamese Error Messages**: Consistent use of Vietnamese for user-facing errors
- **Structured Error Responses**: JSON format with error field for API responses
- **Console Logging**: Detailed error logging with context information
- **Graceful Degradation**: Proper error handling without application crashes

### API Response Patterns (3/5 files)
```javascript
// Success response
res.json(result);

// Error response
res.status(500).json({ error: `Lỗi khi lấy dữ liệu: ${error.message}` });

// CSV export response
res.header('Content-Type', 'text/csv');
res.attachment(`${type}_export.csv`);
res.send(csv);
```

## Internal API Usage and Patterns

### Express.js Route Structure
```javascript
// Page routes
app.get('/', (req, res) => {
    res.render('dashboard');
});

// API routes with error handling
app.get('/api/endpoint', async (req, res) => {
    try {
        const { param1, param2 } = req.query;
        const result = await executeQuery(query, params);
        res.json(result);
    } catch (error) {
        console.error('Lỗi Description:', error);
        res.status(500).json({ error: `Lỗi message: ${error.message}` });
    }
});
```

### Query Module Exports Pattern
```javascript
const moduleQueries = {
    queryName: `SQL QUERY STRING`.replace(/\\n\\s+/g, ' ').trim(),
    anotherQuery: `ANOTHER SQL`.replace(/\\n\\s+/g, ' ').trim()
};

module.exports = moduleQueries;
```

### CSV Generation Pattern (2/5 files)
```javascript
// Header generation
const headers = Object.keys(data[0]);
let csv = headers.join(',') + '\\n';

// Data processing with proper escaping
data.forEach(row => {
    csv += headers.map(header => JSON.stringify(row[header])).join(',') + '\\n';
});
```

## Frequently Used Code Idioms

### Date Format Conversion (4/5 files)
```javascript
// Convert YYYY-MM-DD to YYYYMMDD
startDate.replace(/-/g, '')
endDate.replace(/-/g, '')
```

### Timestamp Generation (2/5 files)
```javascript
const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'') + '_' + 
                 new Date().toISOString().slice(11,19).replace(/:/g,'');
```

### Parameter Validation and Defaults (3/5 files)
```javascript
const params = [
    lineCode || config.lineCode,
    parseInt(rowLimit || config.rowLimit, 10)
];
```

### SQL Query Cleanup (4/5 files)
```javascript
const query = `
    MULTI-LINE
    SQL QUERY
`.replace(/\\n\\s+/g, ' ').trim();
```

## Popular Annotations and Comments

### Section Separators (3/5 files)
```javascript
// ═══════════════════════════════════════════════════════════════
// SECTION NAME - Description
// ═══════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────
// SUBSECTION (Change here)
// ───────────────────────────────────────────────────────────
```

### Vietnamese Documentation (4/5 files)
- Use Vietnamese comments for business logic explanations
- English for technical/code-related comments
- Descriptive error messages in Vietnamese for end users

### Query Documentation (2/5 files)
```javascript
// Query để chỉ lấy [specific data] - An toàn với parameterized queries
// SQL Query để lấy [data type] từ [database]
```

## Development Standards Summary

1. **Security**: Always use parameterized queries, never string concatenation
2. **Configuration**: Centralize all settings in config.js with clear section comments
3. **Error Handling**: Provide meaningful Vietnamese error messages for users
4. **Code Organization**: Separate SQL queries into dedicated modules
5. **Connection Management**: Always close database connections in finally blocks
6. **API Design**: Use consistent RESTful patterns with proper HTTP status codes
7. **File Naming**: Use descriptive names that reflect functionality
8. **Documentation**: Mix Vietnamese for business context, English for technical details