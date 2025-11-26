const express = require('express');
const fs = require('fs');
const path = require('path');
const odbc = require('odbc');
const config = require('../config');
const binQueries = require('../SQLcode/Bin Info.js');
const prodReportQueries = require('../SQLcode/Production Report.js');

const app = express();
const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route chính
app.get('/', (req, res) => {
    res.render('index');
});

// Connection string cho ODBC
const connStr = `DRIVER={IBM i Access ODBC Driver};SYSTEM=${config.hostname};UID=${config.uid};PWD=${config.pwd};DBQ=WAVEDLIB;`;

// API để chạy TRZ50 query với parameters
app.get('/api/trz50', async (req, res) => {
    try {
        const { startDate, endDate, lineCode, rowLimit } = req.query;
        
        console.log('TRZ50 Parameters:', { startDate, endDate, lineCode, rowLimit });
        
        // Tạo parameters
        const params = {
            startDate: startDate ? startDate.replace(/-/g, '') : config.startDate,
            endDate: endDate ? endDate.replace(/-/g, '') : config.endDate,
            lineCode: lineCode || config.lineCode,
            rowLimit: rowLimit || config.rowLimit
        };
        
        // Tạo SQL query
        const sqlQuery = binQueries.trz50(params);
        console.log('Executing TRZ50 query...');
        
        // Kết nối và chạy query
        const connection = await odbc.connect(connStr);
        const result = await connection.query(sqlQuery);
        await connection.close();
        
        console.log(`TRZ50 completed: ${result.length} records`);
        res.json(result);
    } catch (error) {
        console.error('Lỗi TRZ50:', error);
        res.status(500).json({ error: `Lỗi khi chạy TRZ50 query: ${error.message}` });
    }
});

// API để chạy Production Report query với parameters
app.get('/api/production', async (req, res) => {
    try {
        const { startDate, endDate, lineCode, rowLimit } = req.query;
        
        console.log('Production Parameters:', { startDate, endDate, lineCode, rowLimit });
        
        // Tạo parameters
        const params = {
            startDate: startDate ? startDate.replace(/-/g, '') : config.startDate,
            endDate: endDate ? endDate.replace(/-/g, '') : config.endDate,
            lineCode: lineCode || config.lineCode,
            rowLimit: rowLimit || config.rowLimit
        };
        
        // Tạo SQL query
        const sqlQuery = typeof prodReportQueries.productionReportComplex === 'function' 
            ? prodReportQueries.productionReportComplex(params)
            : prodReportQueries.productionReportComplex;
            
        console.log('Executing Production query...');
        
        // Kết nối và chạy query
        const connection = await odbc.connect(connStr);
        const result = await connection.query(sqlQuery);
        await connection.close();
        
        console.log(`Production completed: ${result.length} records`);
        res.json(result);
    } catch (error) {
        console.error('Lỗi Production:', error);
        res.status(500).json({ error: `Lỗi khi chạy Production query: ${error.message}` });
    }
});

// API export CSV
app.get('/api/export/:type', (req, res) => {
    const { type } = req.params;
    const outputDir = path.join(__dirname, '../output');
    
    let pattern;
    if (type === 'trz50') {
        pattern = 'trz50_';
    } else if (type === 'production') {
        pattern = 'productionReportComplex_';
    } else {
        return res.status(400).json({ error: 'Invalid type' });
    }
    
    const files = fs.readdirSync(outputDir)
        .filter(f => f.startsWith(pattern) && f.endsWith('.csv'))
        .sort()
        .reverse();
        
    if (files.length === 0) {
        return res.status(404).json({ error: 'No data file found' });
    }
    
    const csvPath = path.join(outputDir, files[0]);
    res.download(csvPath);
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});