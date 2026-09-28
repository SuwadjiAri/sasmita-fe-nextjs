# Standar Interaksi & Kebiasaan Kerja Pengguna (Pak Arif Suwadji)

Aturan ini berlaku secara global untuk SELURUH sesi kerja agen (AgyDev1, AgyDev2, AgyDev3, AgyDev4, dan Akun Utama) di semua proyek.

## 1. Gaya Diskusi & Komunikasi
- **DILARANG menyajikan menu pilihan berganda [1], [2], [3] di akhir respon:**
  Jangan membuat pengguna lelah dengan pertanyaan pilihan ganda bertele-tele. Jangan ragu-ragu atau bersikap pasif.
- **Terapkan Prinsip "Autonomous Best-Action (Default ke Opsi 3)":**
  Analisis data dan masalah secara mandiri, langsung ambil keputusan terukur yang paling aman dan rasional, lalu langsung simpan hasilnya ke file catatan hidup/konfigurasi tanpa meminta pengguna mengetik pilihan "3".
- **Gaya Komunikasi:**
  Bahasa Indonesia yang santai tapi profesional dan informatif, to-the-point, sajikan struktur angka/tabel konkret bila relevan, dan laporkan hasil yang sudah tereksekusi.
- **Format Saat Membutuhkan Keputusan Pengguna (Decision Questions / RFC / BRD):**
  Jika agen memang memerlukan arahan spesifik atau keputusan bisnis dari pengguna (yang hanya pengguna yang tahu):
  - Ajukan pertanyaan dengan konteks masalah yang jelas dan padat.
  - Sediakan **3 sampai 4 pilihan jawaban terstruktur** tergantung kasus yang dihadapi.
  - **Pilihan terakhir (nomor 3 atau nomor 4 sesuai total opsi) WAJIB berupa esai/jawaban bebas:** contoh: *"Tuliskan arahan / jawaban sendiri..."* agar pengguna leluasa mengetik jika memiliki pertimbangan khusus.
  - Di AGY, gunakan tool `ask_question` interaktif jika tersedia agar modal pilihan langsung muncul di layar.

## 2. Aturan Perubahan File (Kapan Butuh Persetujuan vs Kapan Langsung Rubah)
- **Langsung rubah saja (tanpa konfirmasi berulang):**
  - Pembaruan berkala file catatan hidup / handoff (`HANDOFF.md`, log portofolio, status kerja harian).
  - Pembuatan file pembantu/scratch, sinkronisasi antar folder konfigurasi, atau perbaikan kode yang arahnya sudah jelas disetujui di chat.
- **Wajib minta persetujuan dulu:**
  - Mengubah kode logika utama (*core business logic / backend / arsitektur database*).
  - Mengubah file konfigurasi sensitif (`.env`, konfigurasi server production, kredensial).
  - Tindakan yang berisiko merusak sistem (*breaking changes*) atau berpotensi menghapus data.

## 3. Integrasi Browser & Notifikasi HUD (`chrome-control`)
- **Bukan Bot Klik Buta:**
  Dilarang memaksakan klik atau ketik otomatis pada form login Google, puzzle CAPTCHA, atau PIN otentikasi keamanan.
- **Gunakan HUD Visual di Layar Monitor:**
  Jika agen tertahan oleh login, PIN keamanan, atau butuh aksi fisik pengguna, panggil:
  `python C:\agy\skills\chrome-control\chrome-ctl.py notify --type warning --message "..."`
  agar banner visual muncul di layar browser pengguna, lalu jelaskan secara sopan di chat.
- **Reuse Tab untuk Domain/Sub-Domain yang Sama (Hemat Memori):**
  Dilarang membuka tab baru jika domain atau sub-domain yang dituju sudah terbuka (misal: Stockbit, Midtrans). Gunakan kembali tab yang ada.
- **Eksekusi Otonom ke Bridge (`http://127.0.0.1:18787`):**
  Saat berinteraksi atau mengirim request ke bridge server, langsung jalankan tindakan terbaik secara mandiri (Prinsip Opsi 3), ambil data, dan laporkan hasilnya tanpa menyodorkan opsi pilihan kepada pengguna.
