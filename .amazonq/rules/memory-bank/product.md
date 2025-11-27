# SPC Production Dashboard

## Project Purpose
A comprehensive production monitoring system that provides real-time visibility into manufacturing operations through database connectivity and web-based dashboards. The system enables production teams to track orders, monitor line performance, and receive automated notifications for critical production events.

## Key Features

### Real-Time Production Dashboard
- Live monitoring of production orders with automatic 15-second refresh intervals
- New order notifications with browser pop-up alerts
- Production status tracking (OK/Delay) for completed orders
- Multi-language support (Vietnamese interface)

### Database Integration
- IBM DB2 connectivity for production data retrieval
- ODBC driver support for flexible database connections
- Configurable connection parameters and query limits
- Support for multiple production lines (315, 312, 311, etc.)

### Data Export and Reporting
- CSV export functionality for production reports
- Bin information tracking and reporting
- Configurable date ranges and production line filtering
- Automated report generation with timestamp naming

### Web Interface
- Express.js-based web server with EJS templating
- Responsive dashboard design for production floor displays
- Real-time data updates without page refresh
- Browser notification system for immediate alerts

## Target Users

### Production Managers
- Monitor overall production performance across multiple lines
- Track order completion status and identify delays
- Access historical production data for analysis

### Line Operators
- Receive immediate notifications for new production orders
- View current production queue and priorities
- Monitor line-specific performance metrics

### Quality Control Teams
- Access bin information and production tracking data
- Generate reports for compliance and analysis
- Monitor production status for quality checkpoints

## Use Cases

### Daily Production Monitoring
- Track new orders requiring production attention
- Monitor completion status of recent orders
- Identify production delays and bottlenecks

### Production Line Management
- Configure monitoring for specific production lines
- Set custom date ranges for historical analysis
- Export production data for external reporting

### Alert Management
- Receive browser notifications for new production orders
- Monitor critical production events in real-time
- Maintain visibility across multiple production shifts