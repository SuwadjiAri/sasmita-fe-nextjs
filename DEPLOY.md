# Panduan Deployment SASMITA Frontend (Next.js 16) ke Server Produksi (smita.id)

Dokumen ini menjelaskan alur deployment dan pemeliharaan frontend **SASMITA WEB** pada server Cloud VPS Biznet Gio produksi (`smita.id`).

---

## 1. Arsitektur & Lingkungan Server

- **Domain Utama:** `https://smita.id` (SSL Let's Encrypt aktif).
- **Runtime:** Node.js v20.20.2 LTS, PM2 Process Manager v7.0.4.
- **Framework:** Next.js 16 (React 19 + Turbopack + Tailwind CSS).
- **Service PM2:** `smita-web` (berjalan di port internal `3000`).
- **Lokasi di Server:** `/var/www/sasmita-web` (Owner: `sasmita-user:sasmita-user`).
- **Nginx Reverse Proxy:** Mengarahkan seluruh trafik publik root (`/`) ke `http://127.0.0.1:3000`.

---

## 2. Alur Deployment Pembaruan Kode Frontend

Untuk memperbarui frontend ke server produksi:

### Langkah 1: Uji Kompilasi Lokal
```bash
cd C:\xampp8.2\htdocs\sasmita-web
npm run build
```

### Langkah 2: Kemas Berkas Pembaruan
```powershell
tar -czf sasmita-web-update.tar.gz -C C:\xampp8.2\htdocs\sasmita-web src public package.json
```

### Langkah 3: Unggah ke VPS
```powershell
scp sasmita-web-update.tar.gz sasmita-vps:/home/sasmita-user/
```

### Langkah 4: Eksekusi `deploy.sh` di VPS
```bash
ssh sasmita-vps "/home/sasmita-user/deploy.sh"
```
Skrip akan mengekstrak pembaruan ke `/var/www/sasmita-web`, menjalankan `npm install --legacy-peer-deps`, mengompilasi aset produksi (`npm run build`), dan me-reload proses PM2 tanpa downtime (`pm2 reload smita-web`).

---

## 3. Fitur Utama & Struktur Rute

- `/` $\rightarrow$ Halaman utama portal sastra (kategori, artikel kurasi, ajakan menulis).
- `/redaksi` $\rightarrow$ Halaman struktur Dewan Redaksi, kurator sastra, dan tim artistik.
- `/articles/[slug]` $\rightarrow$ Halaman baca artikel lengkap dengan metadata Editor, Tombol Berbagi Sosial Media (WhatsApp, X, Facebook, Salin Link), dan Kartu Penulis sebelum bagian komentar.
- `/login` & `/register` $\rightarrow$ Halaman autentikasi dengan dukungan Unified 1-Click Google Sign-In & Register.
- `/dashboard/*` $\rightarrow$ Panel kontrol penulis, editor, kurator redaksi, dan administrator.

---

## 4. Troubleshooting & Pemeliharaan PM2

- Cek status aplikasi: `pm2 status`
- Cek log aplikasi: `pm2 logs smita-web --lines 50`
- Restart paksa: `pm2 restart smita-web`

---

## 5. Konfigurasi Google OAuth Client ID

Untuk mengaktifkan tombol Google Sign-In, pastikan `.env.production` di server memiliki:
```ini
NEXT_PUBLIC_GOOGLE_CLIENT_ID=833468072171-h8415ls0fb2oe1b4vmq3aqt1f5t0j11i.apps.googleusercontent.com
```
Jika nilai ini diubah, jalankan `npm run build` dan `pm2 reload smita-web` agar nilai variabel baru terintegrasi ke bundel klien JavaScript.
