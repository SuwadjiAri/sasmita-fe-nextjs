# Rencana Penerapan Produksi SASMITA (API & Web) di Biznet Gio

- **Tanggal Dokumen**: 23 September 2026
- **Status**: Disetujui untuk Produksi (Autonomous Best-Action / Opsi 3)
- **Akun Pendaftaran**: `newssasmita@gmail.com`
- **Penyedia Infrastruktur**: Biznet Gio Cloud (Indonesia)
- **Target Komponen**:
  - Backend: `sasmita-api` (PHP 8.2 / Slim 4 / Eloquent ORM / Phinx)
  - Frontend: `sasmita-web` (Next.js 16 / React 19 / Node.js 20 LTS)

---

## 1. Ringkasan & Keputusan Arsitektur Infrastruktur (Hybrid Strategy)

### A. Evaluasi Rencana: Pemisahan Aplikasi vs Email Branding
Dengan adanya kebutuhan resmi pembuatan **Email Bisnis & Branding Domain `@sasmita.com`**:
- `admin@sasmita.com`
- `redaksi@sasmita.com`
- `support@sasmita.com`
- `marketing@sasmita.com`

## 2. Detail Pembagian Peran Komponen Infrastruktur (Poin 2.1 - 2.3)

### 2.1. Shared Hosting cPanel (Biznet NEO Web Hosting - Mail Server & Email Branding)
- **Produk**: Biznet NEO Web Hosting (Paket Personal ~Rp 25.000 / bulan).
- **Peran**: Dikhususkan 100% sebagai **Corporate Mail Server & Webmail (Roundcube)**.
- **Akun Email Domain Resmi**:
  - `admin@sasmita.com` (Administrasi sistem & operasional)
  - `redaksi@sasmita.com` (Kurasi artikel, jurnalis, & publikasi konten)
  - `support@sasmita.com` (Layanan bantuan pengguna & aduan teknis)
  - `marketing@sasmita.com` (Kerjasama kemitraan, promosi, & sponsorship)
  *(Akun personal karyawan/dosen dapat ditambahkan menyusul)*.
- **Keunggulan Teknis**:
  - Konfigurasi otomatis autentikasi **SPF (Sender Policy Framework)**, **DKIM (DomainKeys Identified Mail)**, dan **DMARC** langsung dari cPanel untuk menjamin reputasi email tinggi dan bebas dari folder SPAM.
  - Server email terisolasi penuh dari server aplikasi. Ketika VPS melakukan build, deploy ulang, atau restart, layanan email kantor tetap aktif 24/7 tanpa interupsi.

### 2.2. Cloud VPS (Biznet NEO Lite MS 4.2 - Komputasi Aplikasi & Database)
- **Produk**: Biznet Gio NEO Lite Paket **MS 4.2** (2 vCPU, 4 GB RAM, 60 GB SSD - Rp 139.000 / bulan).
- **Sistem Operasi**: Ubuntu 24.04 LTS (64-bit) di Data Center Banten / Jakarta.
- **Peran**: Menjalankan seluruh proses komputasi beban tinggi:
  - **Frontend Web**: Next.js 16.2 (React 19 / Node.js 20 LTS) via PM2 di port 3000.
  - **Backend API**: Slim 4 Framework pada PHP 8.2-FPM (`sasmita-api`).
  - **Basis Data**: MariaDB / MySQL Server lokal berkecepatan tinggi via Unix socket/localhost.
- **Alasan Pemilihan**:
  - Menghindari kegagalan *Out-Of-Memory (OOM Killer)* saat proses kompilasi `npm run build` Next.js yang membutuhkan lonjakan RAM ~1.5 GB.

### 2.3. DNS Routing Terpusat (Cloudflare Anycast DNS)
- **Layanan**: Cloudflare Free Tier (Terintegrasi ke Domain `sasmita.com` dari Biznet Registrar).
- **Peran**: Mengatur pembagian rute lalu lintas internet secara cerdas dan aman:
  - **Lalu Lintas Web & API (`A Record`)**:
    - `@` (`sasmita.com`) $\rightarrow$ IP VPS (Proxied / CDN aktif).
    - `www` (`www.sasmita.com`) $\rightarrow$ IP VPS (Proxied / CDN aktif).
    - `api` (`api.sasmita.com`) $\rightarrow$ IP VPS (Proxied / Fast Response).
  - **Lalu Lintas Email (`MX Record` & `CNAME`)**:
    - `MX` `@` $\rightarrow$ `mail.sasmita.com` (Priority 10, DNS Only / Grey Cloud).
    - `A` `mail` $\rightarrow$ IP Shared Hosting cPanel (DNS Only / Grey Cloud).
    - `TXT` (SPF) $\rightarrow$ `v=spf1 +a +mx include:relay.biznetgio.com ~all`.
    - `TXT` (DKIM & DMARC) $\rightarrow$ Menggunakan kunci publik yang digenerate oleh cPanel.
- **Keuntungan**: Kecepatan resolusi DNS di bawah 15ms global, proteksi serangan DDoS Layer 3/4/7 gratis, dan sertifikat Universal SSL gratis.

---

## 3. Matriks Spesifikasi & Estimasi Biaya Bulanan

| Komponen | Produk Biznet Gio | Paket & Spesifikasi | Estimasi Biaya | Peran Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Domain** | **Domain Registrar** | `sasmita.com` | ~Rp 160.000 / tahun | Identitas & branding resmi platform. |
| **Aplikasi & DB** | **NEO Lite (Cloud VPS)** | **MS 4.2** (2 vCPU, 4 GB RAM, 60 GB SSD) | Rp 139.000 / bulan | Menjalankan Next.js 16, Slim 4 API, dan MariaDB tanpa risiko OOM. |
| **Email Server** | **NEO Web Hosting** | **Personal Small / Medium** (cPanel) | ~Rp 25.000 / bulan | Hosting email resmi (`admin@`, `redaksi@`, `support@`, `marketing@`). |
| **DNS & Proteksi** | **Cloudflare** | **Free Plan** | Rp 0 / bulan | Anycast DNS, SSL Universal, Anti-DDoS, & CDN Caching. |
| **Total Estimasi** | — | — | **~Rp 164.000 / bulan** | *(Di luar biaya domain tahunan)* |

---

## 3. Topologi & Routing Server (Hybrid Nginx + cPanel Mail)

```
                            [ Pengguna & Pengunjung ]
                                        │
                                        ▼
                            [ Cloudflare Anycast DNS ]
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │ (Traffic Web & API - A Record)│                               │ (Traffic Email - MX Record)
        ▼                               ▼                               ▼
https://sasmita.com             https://api.sasmita.com                 MX: mail.sasmita.com
        │                               │                               │
        └───────────────┬───────────────┘                               ▼
                        ▼                                   [ Biznet Shared Hosting cPanel ]
      [ Biznet Gio VPS (NEO Lite MS 4.2) ]                  - admin@sasmita.com
                        │                                   - redaksi@sasmita.com
              [ Nginx Reverse Proxy ]                       - support@sasmita.com
               /                   \                        - marketing@sasmita.com
              /                     \                       - Webmail Roundcube
 (Proxy Port 3000)             (FastCGI PHP-FPM)            - SPF / DKIM / DMARC Auto-Records
        ▼                               ▼
[ Next.js 16 (PM2) ]            [ Slim 4 PHP 8.2 ]
 (sasmita-web)                   (sasmita-api)
        │                               │
        └───────────────┬───────────────┘
                        ▼
           [ MySQL Database (Localhost) ]
```

---

## 4. Langkah-Langkah Penerapan (Step-by-Step Deployment)

### Tahap 1: Registrasi & Pembelian Layanan di Biznet Gio
1. Buka [portal.biznetgio.com](https://portal.biznetgio.com).
2. Daftarkan akun baru dengan email: **`newssasmita@gmail.com`**.
3. Pesan Domain (misal `.id` atau `.com`) jika belum ada.
4. Pesan **NEO Lite Paket MS 4.2** dengan OS Ubuntu 24.04 LTS.
5. Selesaikan tagihan via Virtual Account / QRIS / Kartu Kredit. Catat alamat IP Publik VPS yang diberikan.

### Tahap 2: Konfigurasi DNS di Cloudflare
1. Tambahkan domain ke Cloudflare (Free Plan).
2. Ubah Nameserver di registrar Biznet Gio sesuai arahan Cloudflare.
3. Tambahkan DNS Records:
   - `A` | `@` | `<IP_VPS_BIZNET>` | Proxied (Orange Cloud)
   - `A` | `www` | `<IP_VPS_BIZNET>` | Proxied (Orange Cloud)
   - `A` | `api` | `<IP_VPS_BIZNET>` | Proxied (Orange Cloud)

### Tahap 3: Penyusunan Lingkungan VPS (Server Provisioning)
Hubungkan ke VPS via SSH (`ssh root@<IP_VPS_BIZNET>`):
```bash
# 1. Update paket sistem
sudo apt update && sudo apt upgrade -y

# 2. Pasang Nginx, Git, Curl, Unzip
sudo apt install -y nginx git curl unzip ufw

# 3. Pasang Node.js 20 LTS & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# 4. Pasang PHP 8.2-FPM beserta ekstensi yang dibutuhkan
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-gd php8.2-zip php8.2-intl

# 5. Pasang Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# 6. Pasang MariaDB / MySQL Server
sudo apt install -y mariadb-server
sudo mysql_secure_installation
```

### Tahap 4: Penerapan Backend (`sasmita-api`)
1. Clone repositori ke `/var/www/sasmita-api`:
   ```bash
   git clone https://github.com/project-work-sasindo/sasmita-be.git /var/www/sasmita-api
   cd /var/www/sasmita-api
   composer install --no-dev --optimize-autoloader
   ```
2. Buat database dan user MySQL:
   ```sql
   CREATE DATABASE sasmita_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'sasmita_user'@'localhost' IDENTIFIED BY 'PASSWORD_KUAT_PRODUKSI';
   GRANT ALL PRIVILEGES ON sasmita_prod.* TO 'sasmita_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Atur `.env` produksi:
   ```env
   APP_NAME="SASMITA API"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.sasmita.com
   APP_TIMEZONE=Asia/Jakarta

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=sasmita_prod
   DB_USER=sasmita_user
   DB_PASS=PASSWORD_KUAT_PRODUKSI

   JWT_SECRET=HASIL_GENERATE_ACAK_MINIMAL_32_KARAKTER
   JWT_ALGORITHM=HS256
   JWT_EXPIRY=86400

   CORS_ORIGIN=https://sasmita.com

   MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxx
   MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxx
   MIDTRANS_IS_PRODUCTION=true
   MIDTRANS_NOTIFICATION_URL=https://api.sasmita.com/subscription/notification

   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```
4. Jalankan migrasi database:
   ```bash
   vendor/bin/phinx migrate
   ```
5. Sesuaikan hak akses folder unggahan:
   ```bash
   sudo chown -R www-data:www-data /var/www/sasmita-api/public/uploads
   sudo chmod -R 775 /var/www/sasmita-api/public/uploads
   ```

### Tahap 5: Penerapan Frontend (`sasmita-web`)
1. Clone repositori ke `/var/www/sasmita-web`:
   ```bash
   git clone https://github.com/project-work-sasindo/sasmita-fe-nextjs.git /var/www/sasmita-web
   cd /var/www/sasmita-web
   npm install
   ```
2. Buat file `.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.sasmita.com
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-oahy_qzVJCI-A-kj
   NEXT_PUBLIC_MIDTRANS_SNAP_URL=https://app.midtrans.com/snap/snap.js
   NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true
   NEXT_PUBLIC_DEV_MODE=false
   ```
3. Bangun proyek dan jalankan via PM2:
   ```bash
   npm run build
   pm2 start npm --name "sasmita-web" -- start
   pm2 save
   pm2 startup
   ```

### Tahap 6: Konfigurasi Virtual Host Nginx & SSL
1. Konfigurasi Nginx untuk Subdomain API (`/etc/nginx/sites-available/api.sasmita.com`):
   ```nginx
   server {
       listen 80;
       server_name api.sasmita.com;
       root /var/www/sasmita-api/public;
       index index.php;

       client_max_body_size 10M;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
       }

       location ~ /\. {
           deny all;
       }
   }
   ```
2. Konfigurasi Nginx untuk Domain Web Frontend (`/etc/nginx/sites-available/sasmita.com`):
   ```nginx
   server {
       listen 80;
       server_name sasmita.com www.sasmita.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
3. Aktifkan vhost dan pasang SSL Let's Encrypt:
   ```bash
   sudo ln -s /etc/nginx/sites-available/api.sasmita.com /etc/nginx/sites-enabled/
   sudo ln -s /etc/nginx/sites-available/sasmita.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx

   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d sasmita.com -d www.sasmita.com -d api.sasmita.com
   ```

---

## 5. Checklist Validasi Pasca Peluncuran
- [ ] Endpoint health/status API `https://api.sasmita.com` merespons HTTP 200.
- [ ] Web `https://sasmita.com` terbuka sempurna dengan indikator SSL gembok hijau aman.
- [ ] Registrasi & Login pengguna di frontend berhasil terotentikasi ke database backend.
- [ ] Uji transaksi Midtrans Snap Production (QRIS / Bank Transfer) memicu token valid.
- [ ] Callback webhook Midtrans di `https://api.sasmita.com/subscription/notification` sukses memperbarui status langganan menjadi aktif.
- [ ] Unggah cover artikel di halaman editor Tiptap tersimpan rapi di `/uploads`.
