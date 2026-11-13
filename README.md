# Genius Kids Series 2

Repository untuk kumpulan aplikasi edukasi anak yang dibangun dengan HTML, CSS, dan Vanilla JavaScript.

## Aplikasi
- `apps/emotion-hero` — aplikasi pertama: game pengenalan emosi untuk anak.

## Teknologi
- HTML5, CSS3, Vanilla JavaScript (ES Modules)
- PWA: Web App Manifest + Service Worker
- LocalStorage untuk progres dan pengaturan
- Vercel untuk hosting statis

## Menjalankan secara lokal
Jangan membuka `index.html` langsung dengan `file://`, karena ES Modules dan Service Worker memerlukan HTTP.

Cara sederhana:
1. Buka folder `apps/emotion-hero` di VS Code.
2. Jalankan ekstensi Live Server, atau gunakan:
   `python -m http.server 8000`
3. Buka `http://localhost:8000`.

## Deploy ke Vercel
1. Push repository ini ke GitHub.
2. Di Vercel pilih **Add New → Project**, lalu import repository.
3. Atur **Root Directory** menjadi `apps/emotion-hero`.
4. Framework Preset: **Other**.
5. Build Command: kosongkan.
6. Output Directory: `.`.
7. Deploy.

## Catatan audio
Starter ini sudah memiliki audio manager:
- Efek suara dibuat secara lokal menggunakan Web Audio API.
- Instruksi suara menggunakan file MP3 lokal jika tersedia.
- Jika MP3 belum ditambahkan, browser memakai text-to-speech Bahasa Indonesia sebagai fallback pengembangan.

Tambahkan file suara rekaman sendiri ke:
- `assets/audio/narration/`
- `assets/audio/music/`

Nama file narasi mengikuti key yang dipanggil pada `js/components/audio-manager.js`. File audio harus dimiliki atau memiliki lisensi yang sesuai.

## Catatan PWA
- PWA harus dibuka melalui HTTPS atau localhost.
- Setelah aplikasi berhasil dimuat online satu kali, aset inti akan tersimpan di cache.
- Progres tersimpan lokal pada browser/perangkat. Progres tidak otomatis tersinkronisasi antarperangkat.
- Jika mengubah daftar file atau versi aplikasi, naikkan nilai `CACHE_NAME` di `sw.js`.

## Status
Starter foundation: navigasi, pemilihan usia, dashboard peta dunia, gameplay kuis, hasil, reward, pengaturan, LocalStorage, dan PWA dasar.
