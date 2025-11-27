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
app.use(express.json());

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
        const { year, month } = req.query;
        const startDate = `${year}${month.padStart(2, '0')}01`;
        const endDate = `${year}${month.padStart(2, '0')}31`;
        
        const statsQuery = `
            SELECT 
                COUNT(*) AS TOTAL_PRS,
                COUNT(CASE WHEN A.PCPU9D IS NOT NULL AND A.PCPU9D > A.EPFU9D THEN 1 END) AS DELAYED_PRS,
                COUNT(CASE WHEN (A.PCPU9D IS NULL OR A.PCPU9D = 0) THEN 1 END) AS INCOMPLETE_PRS,
                SUM(A.PSCQ9D) AS TOTAL_QTY,
                SUM(COALESCE(A.PCPQ9D, 0)) AS TOTAL_COMP
            FROM (
                SELECT DISTINCT A.PSHN9D, A.PCPU9D, A.EPFU9D, A.PSCQ9D, A.PCPQ9D
                FROM WAVEDLIB.F9D00 AS A
                WHERE A.PSDU9D BETWEEN ? AND ? AND SUBSTRING(A.LN1C9D,1,3) = ? AND A.PSDU9D > 0
            ) AS A
        `.replace(/\n\s+/g, ' ').trim();
        
        const params = [startDate, endDate, '315'];
        const results = await executeQuery(statsQuery, params);
        const stats = results[0] || {};
        

        
        const delayRate = stats.TOTAL_PRS > 0 ? Math.round((stats.DELAYED_PRS / stats.TOTAL_PRS) * 100) : 0;
        const fulfillmentRate = stats.TOTAL_QTY > 0 ? Math.round((stats.TOTAL_COMP / stats.TOTAL_QTY) * 100) : 0;
        
        res.json({
            totalPrs: stats.TOTAL_PRS || 0,
            delayRate: `${delayRate}%`,
            fulfillmentRate: `${fulfillmentRate}%`,
            incompletePrs: stats.INCOMPLETE_PRS || 0
        });
    } catch (error) {
        console.error('Lỗi Dashboard Stats:', error);
        res.status(500).json({ error: `Lỗi khi lấy dữ liệu thống kê: ${error.message}` });
    }
});

app.post('/api/update-status', (req, res) => {
    try {
        const { pr, status } = req.body;
        const statusFile = path.join(__dirname, 'pr_status.json');
        
        // Read existing status data
        let statusData = {};
        if (fs.existsSync(statusFile)) {
            const fileContent = fs.readFileSync(statusFile, 'utf8');
            statusData = JSON.parse(fileContent);
        }
        
        // Update status
        const now = new Date();
        statusData[pr] = {
            status: status,
            updatedAt: now.toISOString(),
            updatedTime: now.toLocaleString('vi-VN', { 
                timeZone: 'Asia/Ho_Chi_Minh',
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Save to file
        fs.writeFileSync(statusFile, JSON.stringify(statusData, null, 2));
        
        res.json({ success: true, message: `PR ${pr} đã cập nhật trạng thái: ${status}` });
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        res.status(500).json({ error: `Lỗi khi cập nhật trạng thái: ${error.message}` });
    }
});

app.get('/api/get-status/:pr', (req, res) => {
    try {
        const { pr } = req.params;
        const statusFile = path.join(__dirname, 'pr_status.json');
        
        if (fs.existsSync(statusFile)) {
            const fileContent = fs.readFileSync(statusFile, 'utf8');
            const statusData = JSON.parse(fileContent);
            res.json(statusData[pr] || null);
        } else {
            res.json(null);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/dashboard/calendar', async (req, res) => {
    try {
        const { year, month } = req.query;
        const startDate = `${year}${month.padStart(2, '0')}01`;
        const endDate = `${year}${month.padStart(2, '0')}31`;
        
        console.log(`Calendar query: ${startDate} to ${endDate}`);
        
        const calendarQuery = `
            SELECT DISTINCT A.PSHN9D AS PR, A.ITMC9D AS ITEM, TRIM(IT1IA0) AS ITEM1, A.PSCQ9D AS QTY, 
                   A.PCPQ9D AS COMP_PCS, A.PSDU9D AS START_D, A.EPFU9D AS EST_COM_D,
                   A.PCPU9D AS ACT_COM_D, CASE WHEN A.PDSC9D = '1' THEN 'REMAKE' ELSE '' END AS REMAKE,
                   CASE WHEN A.PCPU9D IS NOT NULL AND A.PCPU9D > A.EPFU9D THEN 'DELAY' ELSE 'OK' END AS DELAY_DAY
            FROM WAVEDLIB.F9D00 AS A 
            INNER JOIN WAVEDLIB.FA000 ON A.ITMC9D = ITMCA0
            WHERE A.PSDU9D BETWEEN ? AND ? AND SUBSTRING(A.LN1C9D,1,3) = ? AND A.PSDU9D > 0
            ORDER BY A.PSDU9D ASC
        `.replace(/\n\s+/g, ' ').trim();
        
        const params = [startDate, endDate, '315'];
        console.log(`Calendar params: [${params.join(', ')}]`);
        const results = await executeQuery(calendarQuery, params);
        console.log(`Calendar results: ${results.length} records`);
        
        // Remove duplicates by PR number, keep the first one
        const uniqueResults = [];
        const seenPRs = new Set();
        
        for (const row of results) {
            if (!seenPRs.has(row.PR)) {
                seenPRs.add(row.PR);
                uniqueResults.push(row);
            }
        }
        

        
        const events = uniqueResults.map(row => {
            const startDateStr = String(row.START_D).padStart(8, '0');
            const formattedDate = `${startDateStr.substring(0, 4)}-${startDateStr.substring(4, 6)}-${startDateStr.substring(6, 8)}`;
            

            
            function formatDbDate(dateNum) {
                if (!dateNum) return 'N/A';
                const dateStr = String(dateNum).padStart(8, '0');
                return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)}`;
            }
            
            const qty = parseInt(row.QTY) || 0;
            const comp = parseInt(row.COMP_PCS) || 0;
            const isCompleted = !!row.ACT_COM_D;
            const isDelay = row.DELAY_DAY === 'DELAY';
            const isIncomplete = !row.ACT_COM_D || row.ACT_COM_D === 0;
            
            let backgroundColor, borderColor;
            
            if (isDelay) {
                backgroundColor = '#f59e0b'; // Yellow for delay
                borderColor = '#d97706';
            } else if (isCompleted && comp < qty) {
                backgroundColor = '#ef4444'; // Red for shortage
                borderColor = '#dc2626';
            } else if (isCompleted) {
                backgroundColor = '#10b981'; // Green for completed
                borderColor = '#059669';
            } else {
                backgroundColor = '#6b7280'; // Gray for not completed
                borderColor = '#4b5563';
            }
            
            return {
                id: row.PR,
                title: row.PR,
                start: formattedDate,
                backgroundColor,
                borderColor,
                textColor: 'white',
                extendedProps: {
                    pr: row.PR,
                    item: row.ITEM,
                    item1: row.ITEM1,
                    qty: row.QTY,
                    comp: row.COMP_PCS,
                    estCom: row.EST_COM_D ? formatDbDate(row.EST_COM_D) : 'N/A',
                    actCom: row.ACT_COM_D ? formatDbDate(row.ACT_COM_D) : 'N/A',
                    isDelay,
                    isCompleted,
                    isIncomplete,
                    remake: row.REMAKE,
                    shortage: comp < qty ? qty - comp : 0
                }
            };
        });
        
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
        
        // Remove duplicates by PR number, keep the latest one
        const uniqueResults = [];
        const seenPRs = new Set();
        
        for (const row of result) {
            if (!seenPRs.has(row.PR)) {
                seenPRs.add(row.PR);
                uniqueResults.push(row);
            }
        }
        
        res.json(uniqueResults);
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Server đang chạy tại:`);
    console.log(`- Local: http://localhost:${port}`);
    console.log(`- Network: http://[YOUR_IP]:${port}`);
    console.log(`Để truy cập từ máy khác, sử dụng IP của máy này thay vì localhost`);
});
