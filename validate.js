// Database HWID Sederhana dalam Array (bisa diganti Database SQL/NoSQL kedepannya)
// Tambahkan HWID user yang di-whitelist ke dalam list di bawah ini.
const whitelistHWID = [
    "ANDROID-INFINIX-INFINIXX6853-UNKNOWNID"
];

export default function handler(req, res) {
    // Mengizinkan CORS agar web control-panel bisa mengakses api ini jika berbeda domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Mendapatkan parameter HWID dari GET query maupun POST body
    const hwidParam = req.query.hwid || req.body.hwid;

    if (!hwidParam) {
        return res.status(400).json({ status: "error", message: "Missing HWID parameter" });
    }

    const cleanHWID = hwidParam.trim().toUpperCase();

    // Memeriksa apakah HWID terdaftar di array database whitelist
    if (whitelistHWID.includes(cleanHWID)) {
        // Mengembalikan string "VALID" untuk dibaca parser string/find milik Lua Monet/Moonloader
        return res.status(200).send("VALID");
    } else {
        return res.status(203).send("UNREGISTERED_HWID");
    }
}
