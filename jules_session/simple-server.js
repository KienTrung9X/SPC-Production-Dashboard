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

// Hàm helper để chạy query an toàn
async function executeQuery(sql, params) {
    const connection = await odbc.connect(connStr);
    try {
        const result = await connection.query(sql, params);
        return result;
    } finally {
        await connection.close();
    }
}

// API để chạy TRZ50 query với parameters an toàn
app.get('/api/trz50', async (req, res) => {
    try {
        const { startDate, endDate, lineCode, rowLimit } = req.query;
        
        const params = [
            lineCode || config.lineCode,
            startDate ? startDate.replace(/-/g, '') : config.startDate,
            endDate ? endDate.replace(/-/g, '') : config.endDate,
            parseInt(rowLimit || config.rowLimit, 10)
        ];
        
        console.log('Executing TRZ50 query with params:', params);
        const result = await executeQuery(binQueries.trz50, params);
        
        console.log(`TRZ50 completed: ${result.length} records`);
        res.json(result);
    } catch (error) {
        console.error('Lỗi TRZ50:', error);
        res.status(500).json({ error: `Lỗi khi chạy TRZ50 query: ${error.message}` });
    }
});

// API để chỉ lấy TRZ50 updates an toàn
app.get('/api/trz50/updates', async (req, res) => {
    try {
        const { lineCode, lastUpdateDate, lastUpdateTime } = req.query;

        const params = [
            lineCode || config.lineCode,
            parseInt(lastUpdateDate, 10),
            parseInt(lastUpdateDate, 10),
            parseInt(lastUpdateTime, 10)
        ];

        console.log('Executing TRZ50 updates query with params:', params);
        const result = await executeQuery(binQueries.trz50Updates, params);

        console.log(`TRZ50 updates completed: ${result.length} records`);
        res.json(result);
    } catch (error) {
        console.error('Lỗi TRZ50 Updates:', error);
        res.status(500).json({ error: `Lỗi khi chạy TRZ50 updates query: ${error.message}` });
    }
});


// API để chạy Production Report query với parameters an toàn
app.get('/api/production', async (req, res) => {
    try {
        const { startDate, endDate, lineCode, rowLimit } = req.query;
        
        const formattedStartDate = startDate ? startDate.replace(/-/g, '') : config.startDate;
        const formattedEndDate = endDate ? endDate.replace(/-/g, '') : config.endDate;
        const currentLineCode = lineCode || config.lineCode;
        const currentRowLimit = parseInt(rowLimit || config.rowLimit, 10);
        
        const params = [
            formattedStartDate,
            formattedEndDate,
            currentLineCode,
            formattedStartDate,
            formattedEndDate,
            currentLineCode,
            formattedStartDate,
            formattedEndDate,
            currentLineCode,
            currentRowLimit
        ];
        
        console.log('Executing Production query with params...');
        const result = await executeQuery(prodReportQueries.productionReportComplex, params);
        
        console.log(`Production completed: ${result.length} records`);
        res.json(result);
    } catch (error) {
        console.error('Lỗi Production:', error);
        res.status(500).json({ error: `Lỗi khi chạy Production query: ${error.message}` });
    }
});

// API để chỉ lấy Production Report updates an toàn
app.get('/api/production/updates', async (req, res) => {
    try {
        const { lineCode, lastUpdateDate, lastUpdateTime } = req.query;

        const params = [
            lineCode || config.lineCode,
            lineCode || config.lineCode,
            lineCode || config.lineCode,
            parseInt(lastUpdateDate, 10),
            parseInt(lastUpdateDate, 10),
            parseInt(lastUpdateTime, 10)
        ];

        console.log('Executing Production updates query with params:', params);
        const result = await executeQuery(prodReportQueries.productionReportUpdates, params);

        console.log(`Production updates completed: ${result.length} records`);
        res.json(result);
    } catch (error) {
        console.error('Lỗi Production Updates:', error);
        res.status(500).json({ error: `Lỗi khi chạy Production updates query: ${error.message}` });
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
