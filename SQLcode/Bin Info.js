// SQL Query cho Bin Info - TRZ50 Data
const config = require('../config');

const binInfoQueries = {
    // Query: Tất cả dữ liệu TRZ50 - An toàn với parameterized queries
    trz50: `
        SELECT 
            EPFURZ, EPFTRZ, PSOFRZ, PSHNRZ, PIPCRZ, PCLCRZ, ITMCRZ, 
            FA000.IT1IA0, CLRCRZ, ALCQRZ, RTVQRZ, ELSQRZ, BKTNRZ, 
            WABCRZ, MSACRZ, SOACRZ, CCRCRZ, EUCWRZ, SLCCRZ, COMFRZ, 
            LN1CRZ, LN2CRZ, RADURZ, RADTRZ, RUPURZ, RUPTRZ, LNGVRZ, 
            TQ090.SHENQ0, TQ090.RUPUQ0, TQ090.RUPTQ0 
        FROM WAVEDLIB.TRZ50 
            LEFT JOIN S7831F70.WAVEDLIB.TQ090 AS TQ090 
                ON TRIM(CASE WHEN TRZ50.MSACRZ = 'CUT' 
                         THEN TRZ50.WABCRZ 
                         ELSE TRZ50.BKTNRZ END) = TRIM(TQ090.BINCQ0)
            LEFT JOIN WAVEDLIB.FA000 AS FA000 
                ON TRZ50.ITMCRZ = FA000.ITMCA0 
        WHERE LN1CRZ = ?
            AND EPFURZ BETWEEN ? AND ?
        ORDER BY EPFURZ DESC 
        FETCH FIRST ? ROWS ONLY
    `.replace(/\n\s+/g, ' ').trim(),

    // Query để chỉ lấy TRZ50 updates
    trz50Updates: `
        SELECT
            EPFURZ, EPFTRZ, PSOFRZ, PSHNRZ, PIPCRZ, PCLCRZ, ITMCRZ,
            FA000.IT1IA0, CLRCRZ, ALCQRZ, RTVQRZ, ELSQRZ, BKTNRZ,
            WABCRZ, MSACRZ, SOACRZ, CCRCRZ, EUCWRZ, SLCCRZ, COMFRZ,
            LN1CRZ, LN2CRZ, RADURZ, RADTRZ, RUPURZ, RUPTRZ, LNGVRZ,
            TQ090.SHENQ0, TQ090.RUPUQ0, TQ090.RUPTQ0
        FROM WAVEDLIB.TRZ50
            LEFT JOIN S7831F70.WAVEDLIB.TQ090 AS TQ090
                ON TRIM(CASE WHEN TRZ50.MSACRZ = 'CUT'
                         THEN TRZ50.WABCRZ
                         ELSE TRZ50.BKTNRZ END) = TRIM(TQ090.BINCQ0)
            LEFT JOIN WAVEDLIB.FA000 AS FA000
                ON TRZ50.ITMCRZ = FA000.ITMCA0
        WHERE LN1CRZ = ?
            AND (RUPURZ > ? OR (RUPURZ = ? AND RUPTRZ > ?))
        ORDER BY RUPURZ ASC, RUPTRZ ASC
    `.replace(/\n\s+/g, ' ').trim()
};

module.exports = binInfoQueries;
