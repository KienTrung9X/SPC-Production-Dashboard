# DB2 Connection Project

## Project Purpose
A Node.js application for connecting to IBM DB2 databases and executing production reporting queries. The system provides automated data extraction from WAVEDLIB database for manufacturing production analysis and reporting.

## Key Features
- **DB2 Database Integration**: Direct connection to IBM DB2 using ibm_db driver
- **Production Report Generation**: Complex SQL queries for manufacturing production data
- **Configurable Parameters**: Centralized configuration for dates, line codes, and connection settings
- **Multiple Query Support**: Various query types including TRZ50 and production reports
- **Flexible Output**: Structured data extraction with customizable row limits
- **Web Interface**: Express.js server for web-based access (jules_session module)

## Target Users
- **Manufacturing Engineers**: Production line monitoring and analysis
- **Data Analysts**: Manufacturing data extraction and reporting
- **Operations Teams**: Production status tracking and performance metrics
- **System Administrators**: Database connectivity and maintenance

## Use Cases
- Daily production report generation
- Manufacturing line performance analysis
- Production data extraction for external systems
- Real-time production status monitoring
- Historical production data analysis
- Quality control and compliance reporting

## Value Proposition
Streamlines manufacturing data access by providing a simple, configurable interface to complex DB2 production databases, enabling rapid report generation and data analysis for operational decision-making.