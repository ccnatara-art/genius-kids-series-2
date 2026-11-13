# Emotion Hero

Aplikasi PWA edukasi anak untuk pengenalan emosi. Dibangun dengan HTML, CSS, dan Vanilla JavaScript.

## Local development
Jalankan dari folder ini melalui HTTP server, misalnya:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Deploy Vercel
Pilih repository GitHub, lalu set Root Directory ke `apps/emotion-hero`. Framework Preset `Other`, Build Command kosong, Output Directory `.`.

## Catatan
- Audio instruksi MP3 dapat ditambahkan di `assets/audio/narration/`.
- Bila MP3 belum tersedia, browser menggunakan text-to-speech Bahasa Indonesia sebagai fallback.
- Progres disimpan di LocalStorage perangkat.
- Naikkan versi cache di `sw.js` saat mengubah aset inti.
