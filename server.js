const express = require('express');
const odbc = require('odbc');
const path = require('path');
const config = require('./config');
const binQueries = require('./SQLcode/Bin Info.js');
const prodReportQueries = require('./SQLcode/Production Report.js');

const app = express();
const port = process.env.PORT || 3000;

// --- Cấu hình kết nối cơ sở dữ liệu ---
const connStr = `DSN=WAVEDLIB_HN;UID=${config.uid};SYSTEM=${config.hostname};DBQ=QGPL ${config.database};DFTPKGLIB=QGPL;LANGUAGEID=ENU;PKG=QGPL/DEFAULT(IBM),2,0,1,0,512;QRYSTGLMT=-1;CONNTYPE=2;SIGNON=1;`;

// --- Cấu hình Express ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // Cho các file tĩnh như CSS, icon

// --- Routes ---

// Route chính để hiển thị trang dashboard
app.get('/', (req, res) => {
    res.render('index');
});

// API để lấy dữ liệu TRZ50
app.get('/api/trz50', async (req, res) => {
    try {
        const connection = await odbc.connect(connStr);
        const result = await connection.query(binQueries.trz50);
        await connection.close();
        
        const formattedData = result.map(row => ({
            epfurz: row.EPFURZ,
            pshnrz: row.PSHNRZ?.trim(),
            itmcrz: row.ITMCRZ,
            it1ia0: row.IT1IA0?.trim() || 'N/A',
            alcqrz: row.ALCQRZ,
            msacrz: row.MSACRZ?.trim(),
            bktnrz: row.BKTNRZ?.trim(),
            wabcrz: row.WABCRZ?.trim()
        }));
        
        res.json(formattedData);
    } catch (error) {
        console.error('Lỗi TRZ50:', error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu TRZ50' });
    }
});

// API để lấy dữ liệu Production Report
app.get('/api/production', async (req, res) => {
    try {
        const connection = await odbc.connect(connStr);
        const result = await connection.query(prodReportQueries.productionReportComplex);
        await connection.close();
        
        const formattedData = result.map(row => ({
            line: row.Line,
            remake: row.REMAKE,
            pr: row.PR?.trim(),
            item: row.ITEM,
            item1: row.ITEM1?.trim(),
            qty: row.qty,
            est_com_d: row.EST_COM_D,
            act_com_d: row.ACT_COM_D,
            com_status: row.COM_STATUS,
            delay_day: row.DELAY_DAY
        }));
        
        res.json(formattedData);
    } catch (error) {
        console.error('Lỗi Production:', error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu Production Report' });
    }
});

// API để export CSV
app.get('/api/export/:type', async (req, res) => {
    const { type } = req.params;
    try {
        const connection = await odbc.connect(connStr);
        let result, filename;
        
        if (type === 'trz50') {
            result = await connection.query(binQueries.trz50);
            filename = `trz50_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.csv`;
        } else if (type === 'production') {
            result = await connection.query(prodReportQueries.productionReportComplex);
            filename = `production_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.csv`;
        }
        
        await connection.close();
        
        if (!result) {
            return res.status(400).json({ error: 'Invalid export type' });
        }
        
        // Convert to CSV
        const headers = Object.keys(result[0] || {});
        let csv = headers.join(',') + '\n';
        
        result.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            });
            csv += values.join(',') + '\n';
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(csv);
    } catch (error) {
        console.error('Lỗi Export:', error);
        res.status(500).json({ error: 'Lỗi khi export dữ liệu' });
    }
});


// --- Khởi động máy chủ ---
app.listen(port, () => {
    console.log(`Máy chủ đang chạy tại http://localhost:${port}`);
});
