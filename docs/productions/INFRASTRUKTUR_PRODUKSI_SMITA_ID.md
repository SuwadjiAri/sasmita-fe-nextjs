# DOKUMENTASI RESMI INFRASTRUKTUR PRODUKSI SMITA.ID
**Proyek:** SASMITA — Jurnal & Portal Sastra Indonesia (Universitas Pamulang)  
**Domain Resmi:** `smita.id`  
**Provider Infrastruktur:** Biznet Gio Nusantara (`portal.biznetgio.com`)  
**Akun Billing:** `newssasmita@gmail.com`  
**Tanggal Pengesahan:** 23 September 2026  
**Status Pengadaan:** SELESAI DIBELI & AKTIF (Hosting cPanel + Domain `smita.id` + Cloud VPS NEO Lite)

---

## 1. Inventaris Infrastruktur yang Telah Dibeli

| Layanan | Produk / Paket | Spesifikasi Teknis | Fungsi dalam Arsitektur | Status Pembelian |
| :--- | :--- | :--- | :--- | :---: |
| **Domain Utama** | **NEO Domain** | **`smita.id`** (Ekstensi Resmi Indonesia PANDI) | Alamat web resmi jurnal, portal berita sastra, & endpoint API publik. | **AKTIF** |
| **Email Server** | **NEO Web Hosting** (cPanel) | Paket Personal Large / cPanel Shared Hosting | Menangani 100% Mail Server: pembuatan email branding (`admin@smita.id`, `redaksi@smita.id`, `editor@smita.id`, `support@smita.id`). Terisolasi penuh dari server aplikasi. | **AKTIF** |
| **Aplikasi & Database** | **NEO Lite Cloud VPS** | **Paket MS 4.2**:<br>- 2 vCPU<br>- **4 GB RAM**<br>- 60 GB SSD Storage<br>- OS: **Ubuntu 24.04 LTS (Noble Numbat)**<br>- Dedicated Public IPv4 | Menjalankan seluruh stack aplikasi produksi:<br>1. Next.js 16 (PM2 port 3000)<br>2. Slim 4 PHP 8.2-FPM (`sasmita-api`)<br>3. Database MariaDB lokal<br>4. Nginx Reverse Proxy + SSL Let's Encrypt | **AKTIF** |

---

## 2. Arsitektur Hybrid & Pemisahan Beban (Separation of Concerns)

Sistem menggunakan strategi **Hybrid Arsitektur (Opsi 3 - Terukur & Mandiri)** untuk menjamin stabilitas 99.9% uptime:

```
                                  [ Pengunjung / Mahasiswa ]
                                              │
                                              ▼
                             [ DNS Manager: Cloudflare Free ]
                                 Nameserver smita.id
                                      │        │
               ┌──────────────────────┘        └──────────────────────┐
               │ A Record                                             │ MX & A Record
               ▼                                                      ▼
  ┌───────────────────────────────┐                     ┌───────────────────────────────┐
  │   Cloud VPS Biznet NEO Lite   │                     │   NEO Web Hosting (cPanel)    │
  │     (Ubuntu 24.04 LTS)        │                     │   Dedicated Mail Infrastructure│
  ├───────────────────────────────┤                     ├───────────────────────────────┤
  │ • Nginx Web Server (Port 80/443)                     │ • Mail Server Exim/Dovecot    │
  │ • Next.js 16 Web (Port 3000)  │                     │ • Webmail (Roundcube)         │
  │ • Slim 4 PHP 8.2-FPM (Port 9000)                    │ • Otomasi SPF, DKIM, DMARC    │
  │ • Database MariaDB Lokal      │                     │ • Bebas SPAM & Reputasi IP Bersih
  │ • Let's Encrypt Auto-Renewal  │                     │ • Akun: admin@smita.id        │
  └───────────────────────────────┘                     │         redaksi@smita.id      │
                                                        └───────────────────────────────┘
```

### Mengapa Pemisahan Ini Krusial?
1. **Next.js 16 & PHP API Bebas Berakselerasi:** Build aset web frontend dan traffic pembaca jurnal dijalankan di VPS dengan 4 GB RAM. Jika aplikasi di-restart saat deployment fitur baru, **jalur email kampus sama sekali tidak terganggu**.
2. **Reputasi Email Terjamin 100%:** Membangun mail server sendiri di VPS rawan masuk folder SPAM Gmail/Yahoo. Dengan memanfaatkan cPanel Biznet Gio, seluruh parameter keamanan email (SPF, DKIM, DMARC) dikelola otomatis dengan IP cPanel yang memiliki reputasi tinggi.

---

## 3. Rencana Routing DNS Terpusat (`smita.id`)

Setelah Public IP VPS diterbitkan dari portal Biznet Gio, seluruh DNS record diatur sebagai berikut (direkomendasikan via Cloudflare DNS Free):

| Tipe Record | Nama Host / Subdomain | Target / Nilai Konten | Proxy Status | Keterangan |
| :---: | :---: | :---: | :---: | :--- |
| **A** | `@` (`smita.id`) | `[IP_PUBLIC_VPS]` | Proxied (Orange) | Menuju Frontend Next.js 16 |
| **A** | `www` (`www.smita.id`) | `[IP_PUBLIC_VPS]` | Proxied (Orange) | Menuju Frontend Next.js 16 |
| **A** | `api` (`api.smita.id`) | `[IP_PUBLIC_VPS]` | Proxied (Orange) | Menuju Backend Slim 4 PHP-FPM |
| **A** | `mail` (`mail.smita.id`) | `[IP_HOSTING_CPANEL]` | DNS Only (Grey) | Menuju Webmail cPanel Roundcube |
| **MX** | `@` (`smita.id`) | `mail.smita.id` (Priority: 10) | DNS Only (Grey) | Gerbang penerimaan email masuk |
| **TXT** | `@` (`smita.id`) | `v=spf1 include:biznetgio.com ~all` | DNS Only (Grey) | Sender Policy Framework (Anti-SPAM) |
| **TXT** | `default._domainkey` | `[Diambil dari cPanel DKIM]` | DNS Only (Grey) | DKIM Digital Signature |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine;` | DNS Only (Grey) | Kebijakan Keamanan DMARC |

---

## 4. Konfigurasi Aplikasi Produksi

### A. Backend Slim 4 (`sasmita-api`)
* Lokasi di Server: `/var/www/sasmita-api`
* Domain Akses: `https://api.smita.id`
* Environment Variables Produksi (`.env`):
  ```ini
  APP_ENV=production
  APP_DEBUG=false
  APP_URL=https://api.smita.id
  FRONTEND_URL=https://smita.id

  # Database MariaDB Lokal di VPS
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_NAME=sasmita_prod
  DB_USER=sasmita_user
  DB_PASS=[PASSWORD_DATABASE_KUAT]

  # SMTP Mailer (Terkoneksi ke Mail Hosting cPanel)
  MAIL_MAILER=smtp
  MAIL_HOST=mail.smita.id
  MAIL_PORT=465
  MAIL_ENCRYPTION=ssl
  MAIL_USERNAME=noreply@smita.id
  MAIL_PASSWORD=[PASSWORD_EMAIL_CPANEL]
  MAIL_FROM_ADDRESS=noreply@smita.id
  MAIL_FROM_NAME="Jurnal Sasmita Unpam"

  # Midtrans Production Gateway
  MIDTRANS_IS_PRODUCTION=true
  MIDTRANS_SERVER_KEY=[SERVER_KEY_PRODUCTION_MIDTRANS]
  MIDTRANS_CLIENT_KEY=[CLIENT_KEY_PRODUCTION_MIDTRANS]
  ```

### B. Frontend Next.js 16 (`sasmita-web`)
* Lokasi di Server: `/var/www/sasmita-web`
* Domain Akses: `https://smita.id` & `https://www.smita.id`
* Process Manager: **PM2 Daemon** (cluster mode pada port 3000)
* Environment Variables Produksi (`.env.production`):
  ```ini
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=https://api.smita.id/api
  NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=[CLIENT_KEY_PRODUCTION_MIDTRANS]
  NEXT_PUBLIC_SITE_URL=https://smita.id
  ```

---

## 5. Checklist Deployment VPS (Urutan Eksekusi)

Berikut adalah tahapan otomatisasi yang siap dieksekusi setelah Public IP VPS dan kredensial SSH tersedia:

- [ ] **Langkah 1: Koneksi SSH Awal**
  - Akses VPS via SSH: `ssh root@[IP_PUBLIC_VPS]`.
  - Update repository OS: `apt update && apt upgrade -y`.
- [ ] **Langkah 2: Instalasi Base Packages**
  - Web Server: `apt install nginx certbot python3-certbot-nginx -y`.
  - Runtime Node.js: Node.js 20.x LTS + PM2 global (`npm install -g pm2`).
  - Runtime PHP: PHP 8.2-FPM, php8.2-mysql, php8.2-mbstring, php8.2-xml, php8.2-curl, php8.2-gd, php8.2-zip + Composer.
  - Database: `apt install mariadb-server -y` + `mysql_secure_installation`.
- [ ] **Langkah 3: Konfigurasi VirtualHost Nginx & SSL Certbot**
  - Blok Nginx untuk `api.smita.id` (FastCGI ke `php8.2-fpm.sock`).
  - Blok Nginx untuk `smita.id` dan `www.smita.id` (Proxy pass ke `http://127.0.0.1:3000`).
  - Penerbitan sertifikat SSL otomatis: `certbot --nginx -d smita.id -d www.smita.id -d api.smita.id`.
- [ ] **Langkah 4: Deploy Source Code & Migrasi Database**
  - Clone repo / salin source code `sasmita-api` & `sasmita-web`.
  - Jalankan `composer install --no-dev --optimize-autoloader`.
  - Jalankan migrasi Phinx database: `php vendor/bin/phinx migrate`.
  - Jalankan build Next.js: `npm run build` dan start PM2: `pm2 start npm --name "smita-web" -- start`.
  - Setup auto-start PM2: `pm2 startup` & `pm2 save`.

---

*Dokumen ini merupakan standar resmi arsitektur produksi SASMITA dan tersimpan di repositori proyek serta folder `pw-documents\productions`.*
