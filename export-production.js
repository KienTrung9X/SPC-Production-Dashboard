const fs = require('fs');
const path = require('path');
const odbc = require('odbc');
const config = require('./config');
const prodReportQueries = require('./SQLcode/Production Report.js');

const connStr = `DRIVER={IBM i Access ODBC Driver};SYSTEM=${config.hostname};UID=${config.uid};PWD=${config.pwd};DBQ=WAVEDLIB;`;

async function exportProductionCSV() {
    try {
        console.log('Connecting to database...');
        const connection = await odbc.connect(connStr);
        
        // Parameters for main query
        const params = [
            config.startDate, config.endDate, config.lineCode,
            config.startDate, config.endDate, config.lineCode,
            config.startDate, config.endDate, config.lineCode,
            config.rowLimit
        ];
        
        console.log('Executing Production Report query...');
        const result = await connection.query(prodReportQueries.productionReportComplex, params);
        
        await connection.close();
        
        if (result.length === 0) {
            console.log('No data found');
            return;
        }
        
        // Generate CSV
        const headers = Object.keys(result[0]);
        let csv = headers.join(',') + '\n';
        
        result.forEach(row => {
            csv += headers.map(header => JSON.stringify(row[header] || '')).join(',') + '\n';
        });
        
        // Save to file
        const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'') + '_' + 
                         new Date().toISOString().slice(11,19).replace(/:/g,'');
        const filename = `production_report_${timestamp}.csv`;
        const filepath = path.join(__dirname, 'output', filename);
        
        // Ensure output directory exists
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        
        fs.writeFileSync(filepath, csv, 'utf8');
        console.log(`✓ Exported ${result.length} records to ${filename}`);
        
    } catch (error) {
        console.error('Export failed:', error.message);
    }
}

// Run export
exportProductionCSV();