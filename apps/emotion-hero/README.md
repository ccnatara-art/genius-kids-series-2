# Emotion Hero

Aplikasi game edukasi sosial-emosional untuk anak usia 3–12 tahun.

## Gameplay v1.2
- Emotion Garden: mencocokkan ekspresi/perasaan dengan drag-and-drop atau tap.
- Feelings Detective: memilih interpretasi dari petunjuk cerita.
- Body Signal Forest: mengenali kemungkinan sinyal tubuh.
- Calm Island: memilih strategi aman; misi pertama memiliki latihan napas self-paced yang boleh dilewati.
- Kindness Kingdom: memilih respons penuh perhatian melalui cerita.

## Menjalankan lokal
Jalankan server lokal dari folder ini, misalnya `python -m http.server 8000`, lalu buka `http://localhost:8000`.

## Visual assets
Ilustrasi karakter dan lima dunia dibuat sebagai SVG lokal di `assets/images/`.

## Deploy Vercel
Root Directory: `apps/emotion-hero`; Framework: Other; Build Command kosong; Output Directory `.`.

## Penyimpanan dan privasi
Progres disimpan secara lokal di browser/perangkat. Gunakan domain yang sama untuk melanjutkan progres yang sama. Aplikasi tidak mengirim progres ke server.

## PWA
Service Worker cache dinaikkan ke `emotion-hero-v1.2.0` agar file gameplay terbaru diambil saat deployment baru.
