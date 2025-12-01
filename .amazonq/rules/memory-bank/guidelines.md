# SPC Production Dashboard - Development Guidelines

## Code Quality Standards

### File Organization Patterns
- **Modular SQL Queries**: SQL queries are separated into dedicated modules (`SQLcode/` directory) with descriptive filenames
- **Configuration Centralization**: Database and application settings centralized in `config.js` with clear parameter documentation
- **Server Variants**: Multiple server implementations (server.js, simple-server.js) for different deployment scenarios
- **Output Directory**: Dedicated `/output/` directory for generated files and exports

### Naming Conventions
- **File Names**: Use kebab-case for view templates (`dashboard-simple.ejs`, `simple-test.ejs`)
- **Variable Names**: Use camelCase for JavaScript variables (`formattedStartDate`, `currentLineCode`)
- **Database Fields**: Preserve original DB2 field names in uppercase (`PSHN9D`, `ITMC9D`, `EPFU9D`)
- **API Endpoints**: Use descriptive REST-style paths (`/api/dashboard/stats`, `/api/production/updates`)

### Error Handling Patterns
```javascript
// Standard async/await error handling with descriptive messages
try {
    const connection = await odbc.connect(connStr);
    const result = await connection.query(sql, params);
    await connection.close();
    return result;
} catch (error) {
    console.error('Lỗi Production:', error);
    res.status(500).json({ error: `Lỗi khi lấy dữ liệu: ${error.message}` });
}
```

## Database Integration Standards

### Connection Management
- **Connection String Format**: Use DSN-based ODBC connections with parameterized credentials
- **Connection Lifecycle**: Always close connections in finally blocks or after query completion
- **Environment Variables**: Support environment variable overrides for sensitive configuration

### Query Parameterization
```javascript
// Always use parameterized queries for security
const params = [startDate, endDate, lineCode];
const result = await executeQuery(prodReportQueries.productionReportComplex, params);
```

### SQL Query Organization
- **Template Literals**: Use template literals for complex multi-line SQL with `.replace(/\\n\\s+/g, ' ').trim()`
- **Parameter Functions**: Support both static queries and parameterized query functions
- **Query Modules**: Export query objects with descriptive method names

## API Design Patterns

### Route Organization
```javascript
// Group routes by functionality with clear section comments
// =================================================================
// == API Routes for Dashboard
// =================================================================
app.get('/api/dashboard/stats', async (req, res) => {
    // Implementation
});
```

### Response Formatting
- **Consistent JSON Structure**: Always return structured JSON with error handling
- **Data Transformation**: Transform database field names to user-friendly formats
- **Duplicate Removal**: Implement deduplication logic for database results

### File Operations
```javascript
// CSV export with proper headers and encoding
res.header('Content-Type', 'text/csv; charset=utf-8');
res.attachment(`production_${timestamp}.csv`);
```

## Frontend Integration

### Template Engine Usage
- **EJS Templates**: Use EJS for server-side rendering with descriptive template names
- **Static Assets**: Serve static files from `/public/` directory
- **View Organization**: Separate templates by functionality in `/views/` directory

### Real-time Updates
- **Polling Pattern**: Implement client-side polling every 15 seconds for live data
- **Browser Notifications**: Integrate browser notification API for new order alerts
- **Calendar Integration**: Use FullCalendar or similar libraries for production scheduling

## Configuration Management

### Environment Configuration
```javascript
// Support both config file and environment variables
const connStr = process.env.DB_CONN_STR || 
    `DSN=WAVEDLIB_HN;UID=${config.uid};SYSTEM=${config.hostname};...`;
```

### Parameter Documentation
```javascript
// Clear parameter documentation with examples
const config = {
    startDate: 20250101,  // Ngày bắt đầu (YYYYMMDD)
    endDate: 20251231,    // Ngày kết thúc (YYYYMMDD)
    lineCode: '315',      // Mã dây chuyền (315, 312, 311, v.v.)
    rowLimit: 10000000    // Số bản ghi tối đa
};
```

## Performance Optimization

### Query Optimization
- **FETCH FIRST**: Use `FETCH FIRST n ROWS ONLY` for result limiting
- **Indexed Filtering**: Filter by indexed fields like date ranges and line codes
- **JOIN Optimization**: Use appropriate JOIN types (LEFT JOIN, INNER JOIN) based on data relationships

### Memory Management
- **Connection Pooling**: Close database connections promptly to prevent resource leaks
- **Result Deduplication**: Remove duplicate records at application level when needed
- **Streaming for Large Exports**: Use streaming for large CSV exports

## Security Practices

### Input Validation
- **Parameterized Queries**: Always use parameterized queries to prevent SQL injection
- **Input Sanitization**: Validate and sanitize user inputs before processing
- **Environment Variables**: Store sensitive credentials in environment variables

### Error Information
- **Generic Error Messages**: Return generic error messages to clients while logging detailed errors server-side
- **Credential Protection**: Never expose database credentials in error messages or logs

## Testing and Debugging

### Console Logging
```javascript
// Structured logging with clear prefixes
console.log(`📋 Parameters:`);
console.log(`  • Start Date: ${dynamicConfig.startDate}`);
console.log(`✓ Thành công: ${results.length} bản ghi → ${filename}`);
```

### Command Line Interface
- **Argument Parsing**: Support command-line parameters for batch operations
- **Help Documentation**: Provide clear usage examples and parameter descriptions