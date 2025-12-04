# Development Guidelines

## Code Quality Standards

### File Structure and Organization
- **Modular Architecture**: Separate SQL queries into dedicated modules (SQLcode/ directory)
- **Configuration Management**: Centralized config.js for database connections and parameters
- **Process Management**: Use ecosystem.config.js for PM2 deployment configuration
- **Logging Strategy**: Structured logging with separate error and output files in logs/ directory

### Naming Conventions
- **Variables**: Use camelCase for JavaScript variables (startDate, endDate, lineCode)
- **Constants**: Use UPPERCASE for SQL column aliases (TOTAL_PRS, DELAYED_PRS, ONTIME_PRS)
- **Files**: Use kebab-case for batch files (setup-pm2-server.bat, setup-startup.bat)
- **Database Fields**: Preserve original DB2 field names in uppercase (PSHN9D, ITMC9D, PCPU9D)

### Error Handling Patterns
```javascript
// Standard async/await error handling
try {
    const result = await executeQuery(sql, params);
    res.json(result);
} catch (error) {
    console.error('Descriptive error message:', error);
    res.status(500).json({ error: `User-friendly message: ${error.message}` });
}
```

### Database Connection Management
- **Connection Pooling**: Always close ODBC connections in finally blocks
- **Parameterized Queries**: Use parameter arrays to prevent SQL injection
- **Connection String**: Use environment variables or config.js for database credentials

## Semantic Patterns

### API Route Structure
- **RESTful Endpoints**: Follow /api/resource/action pattern
- **Query Parameters**: Use consistent parameter names (startDate, endDate, lineCode, rowLimit)
- **Response Format**: Standardize JSON responses with error handling

### SQL Query Patterns
- **Complex Joins**: Use LEFT JOIN for optional relationships, INNER JOIN for required data
- **Parameterized Queries**: Replace direct string concatenation with parameter placeholders (?)
- **Query Organization**: Group related queries in modules with descriptive names
- **Performance Optimization**: Use FETCH FIRST n ROWS ONLY for pagination

### Data Processing Patterns
```javascript
// Remove duplicates by key field
const uniqueResults = [];
const seenKeys = new Set();
for (const row of results) {
    if (!seenKeys.has(row.KEY_FIELD)) {
        seenKeys.add(row.KEY_FIELD);
        uniqueResults.push(row);
    }
}
```

### Date Formatting Standards
- **Database Dates**: Store as YYYYMMDD integer format (20250101)
- **Display Dates**: Format as DD/MM/YYYY for Vietnamese locale
- **API Dates**: Accept ISO format (YYYY-MM-DD) and convert to database format

### Configuration Management
- **Environment Variables**: Prioritize environment variables over hardcoded values
- **Default Values**: Provide fallback values in config.js
- **Parameter Validation**: Validate and sanitize input parameters

### File Operations
- **CSV Export**: Use proper escaping for CSV fields containing commas or quotes
- **Directory Management**: Create output directories if they don't exist
- **File Naming**: Include timestamps in generated file names

### Process Management
- **PM2 Configuration**: Use ecosystem.config.js for production deployment
- **Memory Management**: Set max_memory_restart limits
- **Auto-restart**: Configure autorestart with reasonable limits
- **Log Rotation**: Implement proper log file management

### Frontend Integration
- **Real-time Updates**: Use polling mechanism with 15-second intervals
- **Notification System**: Implement browser push notifications for new orders
- **Status Management**: Maintain local status files for order tracking
- **Calendar Integration**: Format data for FullCalendar.js compatibility