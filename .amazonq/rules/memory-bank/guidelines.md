# Development Guidelines

## Code Quality Standards

### File Structure and Organization
- **Modular Architecture**: Separate SQL queries into dedicated modules (SQLcode/ directory)
- **Configuration Centralization**: Use config.js for all configurable parameters
- **Output Directory Management**: Create output/ directory programmatically if not exists
- **Temporary File Cleanup**: Always clean up temporary .vbs files after execution

### Naming Conventions
- **File Names**: Use kebab-case for main files (run-query.js, app-production.js)
- **Directory Names**: Use camelCase for module directories (SQLcode/, jules_session/)
- **Variable Names**: Use camelCase (dbConfig, sqlQuery, csvContent)
- **Constants**: Use descriptive names (connStr, todayDate, startDate)

### Error Handling Patterns
- **Promise-based Error Handling**: Use try-catch with async/await pattern
- **Graceful Degradation**: Provide meaningful error messages with troubleshooting hints
- **Connection Cleanup**: Always close database connections in finally blocks or callbacks
- **File System Safety**: Use fs.existsSync() before file operations

## Semantic Patterns

### Database Connection Management
```javascript
// Standard DB2 connection pattern using VBScript bridge
const vbsScript = `
On Error Resume Next
Set objConn = CreateObject("ADODB.Connection")
objConn.ConnectionString = "Provider=${provider};Data Source=${hostname}..."
objConn.Open
If Err.Number <> 0 Then
    WScript.Echo "ERROR:Connection:" & Err.Description
    WScript.Quit 1
End If
`;
```

### CSV Export Pattern
- **Pipe-delimited Processing**: Split data by '|' character from DB2 results
- **CSV Escaping**: Handle commas, quotes, and newlines in cell data
- **Header Management**: Define headers separately for each query type
- **Timestamp Naming**: Use ISO format with underscores for file naming

### Query Execution Flow
1. **Connection Test**: Always test connection before executing queries
2. **Parameter Injection**: Use template literals with config parameters
3. **Result Processing**: Handle EMPTY, ERROR, and data responses
4. **Output Generation**: Save results to timestamped CSV files

### Console Output Standards
- **Unicode Symbols**: Use ✓, ❌, 🔄, 💾 for visual feedback
- **Structured Logging**: Separate sections with visual dividers (═══)
- **Progress Indicators**: Show step-by-step progress with descriptive messages
- **Vietnamese Language**: Support Vietnamese text in console output

## Internal API Usage

### Configuration Access Pattern
```javascript
const config = require('./config');
// Access centralized parameters
const dbConfig = {
    provider: config.provider,
    hostname: config.hostname,
    database: config.database,
    uid: config.uid,
    pwd: config.pwd
};
```

### Query Module Integration
```javascript
const binQueries = require('./SQLcode/Bin Info.js');
const prodReportQueries = require('./SQLcode/Production Report.js');
// Dynamic query selection
let sqlQuery = binQueries[queryType] || prodReportQueries[queryType];
```

### Express.js API Patterns
- **Route Organization**: Separate API routes from view routes
- **Database Connection per Request**: Open/close connections for each API call
- **Data Transformation**: Format database results before JSON response
- **Error Response Structure**: Consistent error object format

## Code Idioms

### Async/Await with IIFE
```javascript
(async () => {
    try {
        // Main execution logic
        await testConnection();
        const results = await queryDB2(sqlQuery);
        // Process results
    } catch (error) {
        console.error("❌ Lỗi:", error.message);
        process.exit(1);
    }
})();
```

### File System Operations
```javascript
// Directory creation pattern
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}
```

### Command Line Argument Processing
```javascript
const queryType = process.argv[2] || 'defaultQuery';
const queryName = {
    'trz50': 'Tape/Bin Info (TRZ50)',
    'productionReport': 'Production Report (Simplified)'
};
```

## Frequently Used Annotations

### SQL Template Literals
- Use `${config.parameter}` for dynamic parameter injection
- Escape quotes with `replace(/"/g, '""')` for VBScript compatibility
- Include FETCH FIRST ${config.rowLimit} ROWS ONLY for result limiting

### Process Management
- Use `process.exit(0)` for successful completion
- Use `process.exit(1)` for error conditions
- Set maxBuffer for large query results: `{ maxBuffer: 10 * 1024 * 1024 }`

### Date/Time Handling
- Use ISO format for timestamps: `toISOString().slice(0,10).replace(/-/g,'')`
- Support both Julian and standard date formats for DB2 compatibility
- Include time components for unique file naming