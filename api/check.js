const LICENSES = [
    { hwid: "HWID-RedmiNote6Pro-sdm636", bot: "ALL", nama: "ZaxxMewing", expired: "0" },
    { hwid: "HWID-RMX2195-bengal", bot: "ALL", nama: "Apacih", expired: "0" },
    { hwid: "HWID-SM-A055F-a05m", bot: "ALL", nama: "Kuzi", expired: "0" },
    { hwid: "PC-UUID00000000-0000-0000-0000-D8CB8A1CBC28", bot: "ALL", nama: "Runzy", expired: "0" },
    { hwid: "HWID-Redmi8-QC_Reference_Phone", bot: "ALL", nama: "Zaxx", expired: "0" },
    { hwid: "HWID-SM-A505F-exynos9610", bot: "ALL", nama: "Trial", expired: "2026-05-23 12:00" },
];

function parseExpired(expStr) {
    if (!expStr || expStr === '0') return 0;
    
    let dateStr = expStr.trim();
    
    if (dateStr.includes(' ')) {
        const parts = dateStr.split(' ');
        const dateParts = parts[0].split('-');
        const timeParts = parts[1].split(':');
        
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);
        const hour = parseInt(timeParts[0]) || 0;
        const minute = parseInt(timeParts[1]) || 0;
        const second = parseInt(timeParts[2]) || 0;
        
        const wibDate = new Date(Date.UTC(year, month, day, hour - 7, minute, second));
        return wibDate.getTime();
    }
    
    if (dateStr.includes('-') && dateStr.split('-').length === 3) {
        const parts = dateStr.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        
        const wibDate = new Date(Date.UTC(year, month, day, 23 - 7, 59, 59));
        return wibDate.getTime();
    }
    
    if (/^\d+$/.test(dateStr)) {
        return parseInt(dateStr) * 1000;
    }
    
    return -1;
}

module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');
    
    const id = (req.query.id || '').trim();
    const bot = (req.query.bot || 'ALL').trim();
    
    if (!id) return res.send('invalid');
    
    const found = LICENSES.find(l => 
        l.hwid === id && 
        (l.bot === 'ALL' || l.bot === bot)
    );
    
    if (!found) {
        return res.send('nonaktif');
    }
    
    const expTimestamp = parseExpired(found.expired);
    
    if (expTimestamp === 0) {
        return res.send('aktif');
    }
    
    if (expTimestamp === -1) {
        return res.send('expired');
    }
    
    const now = Date.now();
    
    if (now >= expTimestamp) {
        return res.send('expired');
    }
    
    res.send('aktif');
};
