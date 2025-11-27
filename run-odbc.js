const fs = require('fs');
const path = require('path');
const odbc = require('odbc');
const config = require('./config');
const binQueries = require('./SQLcode/Bin Info.js');
const prodReportQueries = require('./SQLcode/Production Report.js');

// Connection string cho ODBC
const connStr = `DRIVER={IBM i Access ODBC Driver};SYSTEM=${config.hostname};UID=${config.uid};PWD=${config.pwd};DBQ=WAVEDLIB;`;

// Hàm lưu CSV
function saveToCSV(filename, headers, data) {
    return new Promise((resolve, reject) => {
        try {
            const outputDir = path.join(__dirname, 'output');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }

            const filepath = path.join(outputDir, filename);
            let csvContent = headers.join(',') + '\n';
            
            data.forEach(row => {
                const cells = Object.values(row).map(cell => {
                    const cellStr = String(cell || '').trim();
                    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                        return '"' + cellStr.replace(/"/g, '""') + '"';
                    }
                    return cellStr;
                });
                csvContent += cells.join(',') + '\n';
            });
            
            fs.writeFileSync(filepath, csvContent, 'utf8');
            resolve(filepath);
        } catch (error) {
            reject(error);
        }
    });
}

// Hàm query DB2 với ODBC
async function queryDB2(sqlQuery) {
    try {
        const connection = await odbc.connect(connStr);
        const result = await connection.query(sqlQuery);
        await connection.close();
        return result;
    } catch (error) {
        throw new Error(`Lỗi query: ${error.message}`);
    }
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const queryType = args[0] || 'trz50';
    const params = {};
    
    args.forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.substring(2).split('=');
            params[key] = value;
        }
    });
    
    return { queryType, params };
}

// Chạy query với parameters
(async () => {
    try {
        const { queryType, params } = parseArgs();
        
        console.log("════════════════════════════════════════════════");
        console.log(`    CHẠY QUERY: ${queryType.toUpperCase()}`);
        console.log("════════════════════════════════════════════════\n");

        // Cập nhật config với parameters từ command line
        const dynamicConfig = { ...config };
        if (params.startDate) dynamicConfig.startDate = params.startDate;
        if (params.endDate) dynamicConfig.endDate = params.endDate;
        if (params.lineCode) dynamicConfig.lineCode = params.lineCode;
        if (params.rowLimit) dynamicConfig.rowLimit = params.rowLimit;
        
        console.log(`📋 Parameters:`);
        console.log(`  • Start Date: ${dynamicConfig.startDate}`);
        console.log(`  • End Date: ${dynamicConfig.endDate}`);
        console.log(`  • Line Code: ${dynamicConfig.lineCode}`);
        console.log(`  • Row Limit: ${dynamicConfig.rowLimit}\n`);

        const timestamp = new Date().toISOString().slice(0,10).replace(/-/g,'') + '_' + new Date().toISOString().slice(11,19).replace(/:/g,'');
        
        // Gộp tất cả queries
        const allQueries = {
            ...binQueries,
            ...prodReportQueries
        };

        // Headers cho từng query type
        const headers = {
            'trz50': ['EPFURZ', 'EPFTRZ', 'PSOFRZ', 'PSHNRZ', 'PIPCRZ', 'PCLCRZ', 'ITMCRZ', 'IT1IA0', 'CLRCRZ', 'ALCQRZ', 'RTVQRZ', 'ELSQRZ', 'BKTNRZ', 'WABCRZ', 'MSACRZ', 'SOACRZ', 'CCRCRZ', 'EUCWRZ', 'SLCCRZ', 'COMFRZ', 'LN1CRZ', 'LN2CRZ', 'RADURZ', 'RADTRZ', 'RUPURZ', 'RUPTRZ', 'LNGVRZ', 'SHENQ0', 'RUPUQ0', 'RUPTQ0'],
            'productionReportComplex': ['Line', 'Line_Name', 'Remake', 'Remake_Link', 'PR', 'Item', 'Item1', 'Item2', 'Item3', 'Class', 'Leng', 'Unit', 'Color', 'Qty', 'Start_D', 'Start_T', 'Est_Com_D', 'Est_Com_T', 'Act_Com_D', 'Act_Com_T', 'Delay_Day', 'Delay_Unit', 'Area', 'Com_Status', 'Comp_Pcs', 'MC_Date', 'MC_Time', 'Status', 'Print_D', 'Print_T', 'Tape_Out', 'TP_Area', 'Rupuq0', 'Ruptq0']
        };

        const queryFunction = allQueries[queryType];
        if (!queryFunction) {
            console.log(`❌ Query type '${queryType}' không tồn tại`);
            console.log(`Available queries: ${Object.keys(allQueries).join(', ')}`);
            process.exit(1);
        }

        // Tạo SQL query với parameters
        const finalQuery = typeof queryFunction === 'function' ? queryFunction(dynamicConfig) : queryFunction;
        
        console.log('Final SQL Query:', finalQuery.substring(0, 200) + '...');

        console.log(`🔄 Đang chạy query...`);
        const results = await queryDB2(finalQuery);
        
        if (results.length > 0) {
            const filename = `${queryType}_${timestamp}.csv`;
            const queryHeaders = headers[queryType] || Object.keys(results[0]);
            
            await saveToCSV(filename, queryHeaders, results);
            console.log(`✓ Thành công: ${results.length} bản ghi → ${filename}`);
        } else {
            console.log(`⚠️ Không có dữ liệu`);
        }
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Lỗi:", error.message);
        process.exit(1);
    }
})();