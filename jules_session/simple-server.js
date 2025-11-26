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

// =================================================================
// == Page Routes
// =================================================================
app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/data', (req, res) => {
    res.render('data');
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
        const result = await executeQuery(binQueries.trz50, params);
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
        const result = await executeQuery(binQueries.trz50Updates, params);
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

// API để xuất dữ liệu ra CSV
app.get('/api/export/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const { startDate, endDate, lineCode, rowLimit } = req.query;
        let data;
        let query;
        let params;

        if (type === 'trz50') {
            query = binQueries.trz50;
            params = [
                lineCode || config.lineCode,
                startDate ? startDate.replace(/-/g, '') : config.startDate,
                endDate ? endDate.replace(/-/g, '') : config.endDate,
                parseInt(rowLimit || config.rowLimit, 10)
            ];
        } else if (type === 'production') {
            query = prodReportQueries.productionReportComplex;
            const formattedStartDate = startDate ? startDate.replace(/-/g, '') : config.startDate;
            const formattedEndDate = endDate ? endDate.replace(/-/g, '') : config.endDate;
            const currentLineCode = lineCode || config.lineCode;
            const currentRowLimit = parseInt(rowLimit || config.rowLimit, 10);
            params = [
                formattedStartDate, formattedEndDate, currentLineCode,
                formattedStartDate, formattedEndDate, currentLineCode,
                formattedStartDate, formattedEndDate, currentLineCode,
                currentRowLimit
            ];
        } else {
            return res.status(400).send('Loại export không hợp lệ');
        }

        data = await executeQuery(query, params);

        if (data.length === 0) {
            return res.status(404).send('Không có dữ liệu để xuất');
        }

        const headers = Object.keys(data[0]);
        let csv = headers.join(',') + '\\n';
        data.forEach(row => {
            csv += headers.map(header => JSON.stringify(row[header])).join(',') + '\\n';
        });

        res.header('Content-Type', 'text/csv');
        res.attachment(`${type}_export.csv`);
        res.send(csv);

    } catch (error) {
        console.error(`Lỗi khi export ${req.params.type}:`, error);
        res.status(500).send(`Lỗi server khi đang xử lý export: ${error.message}`);
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
