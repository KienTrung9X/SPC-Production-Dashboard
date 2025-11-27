const express = require('express');
const fs = require('fs');
const path = require('path');
const odbc = require('odbc');
const config = require('./config');
// const binQueries = require('./SQLcode/Bin Info.js');
const prodReportQueries = require('./SQLcode/Production Report.js');

const app = express();
const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// =================================================================
// == Page Routes
// =================================================================
app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/data', (req, res) => {
    res.render('data');
});

app.get('/test', (req, res) => {
    res.render('simple-test');
});

// =================================================================
// == API Routes for Dashboard
// =================================================================
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const params = [
            startDate.replace(/-/g, ''),
            endDate.replace(/-/g, '')
        ];
        const result = await executeQuery(prodReportQueries.getMonthlyStats, params);
        res.json(result[0] || {});
    } catch (error) {
        console.error('Lỗi Dashboard Stats:', error);
        res.status(500).json({ error: `Lỗi khi lấy dữ liệu thống kê: ${error.message}` });
    }
});

app.get('/api/dashboard/events', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const params = [
            startDate.replace(/-/g, ''),
            endDate.replace(/-/g, '')
        ];
        const results = await executeQuery(prodReportQueries.getCalendarEvents, params);
        
        const events = results.map(row => ({
            title: row.TITLE,
            start: `${String(row.START_DATE).substring(0, 4)}-${String(row.START_DATE).substring(4, 6)}-${String(row.START_DATE).substring(6, 8)}`
        }));
        
        res.json(events);
    } catch (error) {
        console.error('Lỗi Calendar Events:', error);
        res.status(500).json({ error: `Lỗi khi lấy dữ liệu lịch: ${error.message}` });
    }
});

// =================================================================
// == API Routes for Data Table Page
// =================================================================





// API để chạy Production Report query với parameters an toàn
app.get('/api/production', async (req, res) => {
    try {
        const { startDate, endDate, lineCode, rowLimit } = req.query;
        const formattedStartDate = startDate ? startDate.replace(/-/g, '') : config.startDate;
        const formattedEndDate = endDate ? endDate.replace(/-/g, '') : config.endDate;
        const currentLineCode = lineCode || config.lineCode;
        const currentRowLimit = parseInt(rowLimit || config.rowLimit, 10);
        
        const params = [
            formattedStartDate, formattedEndDate, currentLineCode,
            formattedStartDate, formattedEndDate, currentLineCode,
            formattedStartDate, formattedEndDate, currentLineCode,
            currentRowLimit
        ];
        const result = await executeQuery(prodReportQueries.productionReportComplex, params);
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
        const result = await executeQuery(prodReportQueries.productionReportUpdates, params);
        res.json(result);
    } catch (error) {
        console.error('Lỗi Production Updates:', error);
        res.status(500).json({ error: `Lỗi khi chạy Production updates query: ${error.message}` });
    }
});

// API để tải CSV trực tiếp từ SQL
app.get('/api/download-csv', async (req, res) => {
    try {
        const { startDate, endDate, lineCode } = req.query;
        const formattedStartDate = startDate ? startDate.replace(/-/g, '') : config.startDate;
        const formattedEndDate = endDate ? endDate.replace(/-/g, '') : config.endDate;
        const currentLineCode = lineCode || config.lineCode;
        
        const params = [
            formattedStartDate, formattedEndDate, currentLineCode,
            formattedStartDate, formattedEndDate, currentLineCode,
            formattedStartDate, formattedEndDate, currentLineCode,
            10000000 // Large limit for CSV export
        ];
        
        const data = await executeQuery(prodReportQueries.productionReportComplex, params);
        
        if (data.length === 0) {
            return res.status(404).send('Không có dữ liệu để tải');
        }

        const headers = Object.keys(data[0]);
        let csv = headers.join(',') + '\n';
        data.forEach(row => {
            csv += headers.map(header => JSON.stringify(row[header] || '')).join(',') + '\n';
        });

        const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'') + '_' + 
                         new Date().toISOString().slice(11,19).replace(/:/g,'');
        
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment(`production_${timestamp}.csv`);
        res.send(csv);

    } catch (error) {
        console.error('Lỗi khi tải CSV:', error);
        res.status(500).send(`Lỗi server: ${error.message}`);
    }
});

// =================================================================
// == Helper Functions and Server Start
// =================================================================

const connStr = `DRIVER={IBM i Access ODBC Driver};SYSTEM=${config.hostname};UID=${config.uid};PWD=${config.pwd};DBQ=WAVEDLIB;`;

async function executeQuery(sql, params) {
    const connection = await odbc.connect(connStr);
    try {
        return await connection.query(sql, params);
    } finally {
        await connection.close();
    }
}

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
