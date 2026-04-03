# Dashboard Air Bersih Kalimantan Selatan

Dashboard visualisasi data PDAM Kalimantan Selatan berbasis data BPS.  
Dikembangkan untuk **data.mentaos.id**.

---

## Deploy ke Vercel (pertama kali)

### Prasyarat
- Akun [GitHub](https://github.com) dan [Vercel](https://vercel.com)
- Node.js 18+ (`node --version`)

### Langkah-langkah

**1. Buat repositori GitHub**
```bash
# Di GitHub: buat repo baru bernama "air-bersih-kalsel" (Public)
```

**2. Upload proyek ini**
```bash
cd air-bersih-kalsel
git init
git add .
git commit -m "initial: dashboard air bersih kalsel"
git branch -M main
git remote add origin https://github.com/USERNAME/air-bersih-kalsel.git
git push -u origin main
```

**3. Hubungkan ke Vercel**
- Buka [vercel.com/new](https://vercel.com/new)
- Pilih repo `air-bersih-kalsel`
- Framework: **Vite** (otomatis terdeteksi)
- Klik **Deploy**

**4. Custom domain (opsional)**
- Di Vercel dashboard → Settings → Domains
- Tambah `air.mentaos.id` atau domain pilihan Anda
- Tambah CNAME record di DNS provider Anda:
  ```
  air  CNAME  cname.vercel-dns.com
  ```

---

## Memperbarui data (setiap tahun)

### Prasyarat
```bash
pip install requests  # atau: pip3 install requests
```

### Cara update

**1. Buka Google Sheets template**  
Link: `https://docs.google.com/spreadsheets/d/17l_eZWF6lINGfqKv3GyYsyRHYcRhG1cnxBJQUHBgX9E`

**2. Tambah data tahun baru**  
Di setiap sheet (01–06), salin baris 2024 ke bawah dan ubah `tahun_data` ke tahun baru.  
Script akan otomatis mengambil baris dengan tahun terbesar.

> **Penting:** Ikuti konvensi BPS N-1.  
> Publikasi 2026 → isi `tahun_data = 2025`.

**3. Jalankan script sync**
```bash
python scripts/sync_data.py
```

Output yang diharapkan:
```
Memperbarui data dari Google Sheets...
  Mengambil 01_PRODUKSI... → 12 baris, tahun 2025
  Mengambil 02_PELANGGAN... → 12 baris
  ...
  Selesai. Jalankan berikutnya:
    git add src/data.js
    git commit -m 'update data 2025'
    git push
```

**4. Push ke GitHub**
```bash
git add src/data.js
git commit -m "update data 2025"
git push
```

Vercel akan otomatis deploy dalam ~1 menit.

---

## Pengembangan lokal

```bash
npm install
npm run dev
# Buka http://localhost:5173
```

---

## Struktur proyek

```
air-bersih-kalsel/
├── src/
│   ├── App.jsx          ← komponen dashboard utama
│   ├── data.js          ← semua data (diperbarui oleh sync_data.py)
│   ├── main.jsx         ← entry point React
│   └── index.css        ← design system
├── scripts/
│   └── sync_data.py     ← script update data dari Google Sheets
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Menambah kabupaten/indikator baru

1. Tambah data di `src/data.js` mengikuti format yang ada
2. Sesuaikan array `KABUPATEN` dan `KABUPATEN_SHORT`
3. Tambah parsing di `scripts/sync_data.py` jika perlu

---

## Sumber data

| Publikasi | Katalog BPS | Sumber |
|---|---|---|
| Statistik Air Bersih Kalsel Tahun 2024 | 6206001.63 | [kalsel.bps.go.id](https://kalsel.bps.go.id) |

---

## Lisensi

Kode: MIT  
Data: © BPS Provinsi Kalimantan Selatan (digunakan sesuai ketentuan BPS)
