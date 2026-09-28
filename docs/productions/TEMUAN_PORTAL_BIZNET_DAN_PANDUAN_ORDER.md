# TEMUAN PORTAL BIZNET GIO & PANDUAN EKSEKUSI ORDER PRODUKSI
**Proyek:** SASMITA (Jurnal & Website Sastra Indonesia - Universitas Pamulang)  
**Target Domain:** `sasmita.com`  
**Akun Portal:** `newssasmita@gmail.com`  
**Tanggal Investigasi:** 23 September 2026  
**Status:** Terverifikasi Valid (Siap Eksekusi)

---

## 1. Ringkasan Eksekutif & Temuan Kritis

Pada proses persiapan pendaftaran domain dan hosting produksi SASMITA melalui portal Biznet Gio (`portal.biznetgio.com`), telah dilakukan inspeksi DOM secara langsung pada tab browser profil `newssasmita@gmail.com`. Ditemukan 2 kondisi penting pada infrastruktur portal Biznet Gio:

### Temuan #1: Modul Standalone Domain (`/domain/neo-domain`) Mengalami Server Error (500)
* **URL:** `https://portal.biznetgio.com/domain/neo-domain`
* **Gejala Tampilan:**
  ```text
  Server error
  An error occurred in the application and your page could not be served.
  If you are the application owner, check your logs for details.
  ```
* **Analisis Teknis:**
  Pesan ini merupakan pesan standar *application container crash* (Heroku / Dokku / Ruby on Rails / Node.js) milik internal tim pengembang Biznet Gio. Terjadi kegagalan (*unhandled exception / internal server error 500*) pada microservice modul domain mandiri Biznet.
* **Dampak:** Pengguna tidak dapat membeli atau mendaftarkan domain secara terpisah melalui menu *Domain -> NEO Domain*.

### Temuan #2: Modul NEO Web Hosting (`/web/neo-web-hosting/create`) Aktif Normal & Menyediakan Bundling Domain Lengkap
* **URL:** `https://portal.biznetgio.com/web/neo-web-hosting/create`
* **Status:** Aktif normal, responsif, dan berjalan pada microservice yang terpisah dari modul domain.
* **Fitur Bundling Terverifikasi (Elemen DOM):**
  1. Radio button `rdoDomain` menyediakan opsi:
     - **`Register new domain`** (Beli domain baru langsung dalam 1 formulir hosting).
     - `I already have a domain name` (Gunakan domain lama).
  2. Input field pencarian: `Search for a domain name...` + Tombol `Check Domain`.
  3. Dropdown pilihan paket hosting: *Personal Small, Personal Medium, Personal Large, Personal Extra, Business...*
* **Banner Promo Resmi yang Terverifikasi di Halaman:**
  | Paket Hosting & Bundling | Harga Normal | Harga Promo (1 Tahun) | Diskon | Kode Promo |
  | :--- | :---: | :---: | :---: | :---: |
  | **Hosting Personal Large + Domain .ID/.COM** | ~~Rp 981.000~~ | **Rp 399.000 / thn** | **59%** | **`PROMONWHLARGE`** |
  | **Hosting Personal Medium + Domain .ID** | ~~Rp 846.000~~ | **Rp 349.000 / thn** | **59%** | **`NWHFREEID`** |

---

## 2. Keputusan Arsitektur Terbaik (Autonomous Best-Action / Opsi 3)

Berdasarkan temuan di atas, rencana awal untuk membeli domain terpisah di menu domain **langsung dialihkan 100% ke pemesanan bundling di menu NEO Web Hosting**:

### Mengapa Bundling di NEO Web Hosting adalah Solusi Terbaik?
1. **Bypass Error Server Biznet:** Menghindari modul standalone domain yang sedang down di portal Biznet Gio.
2. **Penghematan Finansial Signifikan:**
   - Jika beli domain terpisah: Domain `.com` ~Rp 190.000 + Hosting cPanel ~Rp 300.000 = **~Rp 490.000/thn**.
   - Dengan Bundling Promo `PROMONWHLARGE`: **Hanya Rp 399.000 / 1 tahun**, sudah mendapatkan **Hosting Personal Large (cPanel) + Domain `sasmita.com` GRATIS 1 tahun**.
3. **Pemisahan Peran yang Kokoh (Hybrid Architecture):**
   - **Hosting cPanel (Personal Large)**: Digunakan 100% untuk Mail Server resmi kampus/jurnal (`redaksi@sasmita.com`, `admin@sasmita.com`, `support@sasmita.com`, `editor@sasmita.com`). Otomasi SPF, DKIM, dan DMARC dari cPanel menjamin email tidak masuk folder SPAM.
   - **Cloud VPS NEO Lite (Paket MS 4.2 - Rp 139.000/bln)**: Menjalankan mesin aplikasi utama Next.js 16 (PM2 port 3000), Slim 4 PHP 8.2-FPM (`sasmita-api`), dan MariaDB lokal. RAM 4 GB mencegah crash Out-Of-Memory saat build aset frontend.
   - **Cloudflare DNS (Gratis)**: Menjadi pengatur lalu lintas; record `@`, `www`, `api` diarahkan ke VPS, sedangkan record `MX` dan `mail` diarahkan ke Shared Hosting cPanel.

---

## 3. Panduan Langkah-demi-Langkah Pemesanan di Portal Biznet

### Tahap 1: Order Bundling Hosting + Domain `sasmita.com`
1. Akses halaman:
   👉 **`https://portal.biznetgio.com/web/neo-web-hosting/create`**
2. Pada bagian **Order Neo Web Hosting**:
   - **Hosting Package**: Pilih **Personal Large**.
3. Pada bagian **Domain**:
   - Pilih radio button: **`Register new domain`**.
   - Masukkan nama domain: **`sasmita.com`**.
   - Klik tombol **Check Domain** (pastikan status domain *Available* / Tersedia).
4. Pada bagian **Billing Cycle**:
   - Pilih periode **1 Year / 1 Tahun**.
5. Pada bagian **Promo Code**:
   - Masukkan kode promo: **`PROMONWHLARGE`** lalu klik Apply/Gunakan.
   - Verifikasi total tagihan menjadi **Rp 399.000** (sebelum PPN 11%).
6. Centang persetujuan SLA & Terms, lalu klik **Order / Checkout**.
7. Lakukan pembayaran (Virtual Account / QRIS / Transfer).

---

### Tahap 2: Order Cloud VPS (NEO Lite MS 4.2)
1. Setelah hosting aktif, klik menu **Compute -> NEO Lite** atau akses:
   👉 **`https://portal.biznetgio.com/compute/neo-lite/create`**
2. Pilih spesifikasi:
   - **Region / Zone**: Jakarta (WJA)
   - **Paket**: **MS 4.2** (2 vCPU, 4 GB RAM, 60 GB SSD) - **Rp 139.000 / bulan**.
   - **Operating System**: **Ubuntu 24.04 LTS 64-bit**.
   - **Billing Cycle**: Bulanan (*Pay-as-you-go* atau Bulanan).
   - **Authentication**: Pilih SSH Key (atau buat SSH Key baru / Password Root yang kuat).
3. Klik **Create / Order** dan selesaikan pembayaran.
4. Catat **Public IP Address** VPS yang diberikan Biznet Gio.

---

### Tahap 3: DNS Routing Terpusat (Cloudflare Setup)
Setelah kedua layanan aktif, arahkan Nameserver `sasmita.com` dari portal Biznet ke Cloudflare:
* Nameserver 1 & 2: Diberikan oleh Cloudflare (misal: `alec.ns.cloudflare.com`).

Konfigurasi DNS Records di Cloudflare Dashboard:
| Tipe | Nama Record | Target / Content | Proxy Status | Keterangan |
| :---: | :---: | :---: | :---: | :---: |
| **A** | `@` (`sasmita.com`) | `[IP_VPS_BIZNET]` | Proxied (Orange Cloud) | Frontend Next.js 16 |
| **A** | `www` | `[IP_VPS_BIZNET]` | Proxied (Orange Cloud) | Frontend Next.js 16 |
| **A** | `api` | `[IP_VPS_BIZNET]` | Proxied (Orange Cloud) | Backend Slim 4 API |
| **A** | `mail` | `[IP_HOSTING_CPANEL]` | DNS Only (Grey Cloud) | Webmail cPanel Roundcube |
| **MX** | `@` | `mail.sasmita.com` (Priority 10) | DNS Only | Jalur kirim/terima email |
| **TXT** | `@` | `v=spf1 include:biznetgio.com ~all` | DNS Only | Validasi SPF Anti-SPAM |
| **TXT** | `default._domainkey` | `[DKIM Key dari cPanel]` | DNS Only | Validasi DKIM Email |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine;` | DNS Only | Validasi DMARC Email |

---

## 4. Struktur Arsip Dokumentasi Proyek

Seluruh dokumen perencanaan dan temuan disimpan pada folder:
`C:\Users\Arif Suwadji\Documents\unpam\project-work\pw-documents\productions\`

Daftar Berkas:
1. `PLAN_DEPLOYMENT_PRODUCTION_SASMITA.md`: Dokumen arsitektur lengkap, konfigurasi Nginx reverse proxy, PM2 daemon Next.js 16, Slim 4 PHP-FPM, skema database MariaDB, integrasi Midtrans, dan otomatisasi SSL Certbot.
2. `TEMUAN_PORTAL_BIZNET_DAN_PANDUAN_ORDER.md`: Dokumen laporan temuan DOM portal Biznet Gio, verifikasi error backend domain Biznet, dan panduan praktis checkout hosting + domain promo.

Dokumen ini disinkronisasikan ke folder dokumen Pak Arif menggunakan script:
`C:\agy\salin-ke-dokumen.bat`.
