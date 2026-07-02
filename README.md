# Generative AI — Presentasi Interaktif

Presentasi web interaktif yang membahas **Generative AI** (Kecerdasan Buatan Generatif): cara kerja, jenis, manfaat, dan tantangannya. Dibuat sebagai situs statis dengan slide berbasis scroll dan animasi.

🔗 **Live demo:** [persentasi-ai-gen.vercel.app](https://persentasi-ai-gen.vercel.app)

## Fitur

- Presentasi berbasis slide dengan navigasi indikator
- Desain responsif dengan latar animasi (blob)
- Konten dalam Bahasa Indonesia
- Tanpa framework — HTML, CSS, dan JavaScript murni

## Struktur Proyek

```
.
├── index.html      # Halaman utama presentasi
├── style.css       # Styling & animasi
├── script.js       # Interaksi slide & navigasi
├── assets/         # Gambar ilustrasi
└── ISI.md          # Naskah / isi materi presentasi
```

## Menjalankan Secara Lokal

Karena ini situs statis, cukup buka `index.html` di browser, atau jalankan server lokal:

```bash
# Python
python3 -m http.server 8000

# atau Node
npx serve
```

Lalu buka http://localhost:8000

## ▲ Deploy ke Vercel

Proyek ini adalah situs statis, jadi tidak perlu konfigurasi build.

**Via dashboard Vercel:**
1. Push repo ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) → **Add New → Project** → import repo ini.
3. Framework Preset: **Other**. Biarkan Build Command & Output Directory kosong.
4. Klik **Deploy**.

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel
```

## Lisensi

Bebas digunakan untuk keperluan edukasi dan presentasi.
