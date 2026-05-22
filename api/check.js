export default async function handler(req, res) {
  // Mengatur Header agar tidak bisa di-spam (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }

  try {
    const { hwid } = req.body;
    if (!hwid) {
      return res.status(400).json({ error: 'HWID tidak boleh kosong' });
    }

    // =====================================================================================
    // AMAN DI SINI: Link GitHub ditaruh di sisi Server, pembeli TIDAK BISA melihat baris ini!
    // Ganti dengan URL RAW whitelist.txt milikmu.
    // =====================================================================================
    const GITHUB_RAW_URL = "https://raw.githubusercontent.com/HarunEpep/Secure/refs/heads/main/whitelist.txt";

    // Ambil data dari github secara real-time (anti-cache)
    const response = await fetch(`${GITHUB_RAW_URL}?t=${new Date().getTime()}`);
    if (!response.ok) {
      return res.status(500).json({ error: 'Gagal sinkronisasi ke server utama' });
    }

    const textData = await response.text();
    
    // Pecah baris teks dan bersihkan karakter
    const whitelistLines = textData
      .split('\n')
      .map(line => line.trim().toUpperCase())
      .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));

    // Cek apakah HWID pembeli terdaftar
    const isExist = whitelistLines.includes(hwid.trim().toUpperCase());

    // Kembalikan jawaban YA atau TIDAK saja ke browser pembeli
    return res.status(200).json({ verified: isExist });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Internal Error' });
  }
}
