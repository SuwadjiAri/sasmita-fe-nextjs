# Proteksi Konten Artikel - SASMITA.COM

Catatan serah terima untuk perlindungan isi artikel di halaman baca.
Berkas ini menjelaskan apa yang sudah berjalan, mengapa dibuat begitu, dan apa
yang sengaja tidak dikejar.

**Berkas utama:** `src/components/ui/ContentProtection.tsx`
**Aturan cetak:** `src/app/globals.css`, blok `@media print` di bagian akhir
**Dipakai di:** `src/app/(public)/articles/[slug]/ArticleContent.tsx`

Riwayat: tahap 1 sampai 3 diselesaikan pada commit `3f72aef` (6 Agustus 2026).
Diuji di peramban pada 7 Agustus 2026, lalu penimpaan clipboard dan perbaikan
watermark ditambahkan. Lihat bagian 8.

---

## 1. Yang Perlu Dipahami Lebih Dulu

Ada dua hal yang sering tertukar, dan membedakannya menentukan sejauh mana
pekerjaan ini masuk akal dikejar.

| | Bisa di peramban? | Keterangan |
|---|---|---|
| **Mendeteksi** pembaca berpindah fokus, ganti tab, menekan tombol | **Bisa** | Peramban menyediakan event `blur`, `focus`, `visibilitychange`, `keydown` |
| **Mencegah** aplikasi perekam layar menangkap gambar | **Tidak bisa** | Perekam berjalan di luar peramban dan tidak tunduk pada kode halaman |

Sistem ujian daring di lab kampus yang berjalan lewat peramban memakai kolom
pertama, bukan kolom kedua. Saat peserta menekan tombol atau berpindah jendela,
sistem **mencatatnya sebagai pelanggaran** lalu melaporkannya ke server.
Rekaman layar tetap mungkin dilakukan, yang membuat orang tidak berani adalah
**akibatnya**, yaitu ujian dibatalkan.

Sebagian sistem ujian memang benar-benar mengunci komputer, tetapi yang seperti
itu bukan halaman web biasa. Contohnya Respondus LockDown Browser dan Safe Exam
Browser, keduanya aplikasi native terpisah yang menggantikan Chrome dan punya
hak akses sistem operasi.

**Kesimpulan praktisnya untuk SASMITA:** blur berguna sebagai penghalang bagi
pembaca biasa dan sebagai penanda bahwa isi ini dijaga. Yang benar-benar
melindungi karya berbayar tetap pemangkasan di sisi server, yaitu
`PremiumAccessPolicy` di repositori API, yang membuat naskah premium memang
tidak pernah dikirim ke pembaca tanpa langganan.

Jangan menjanjikan ke pengguna bahwa artikel tidak bisa direkam. Itu tidak benar
dan mudah dipatahkan: matikan JavaScript, atau buka View Page Source, teksnya
terbaca utuh.

---

## 2. Keadaan Sekarang

| Perilaku | Pemicu | Jangkauan |
|---|---|---|
| Isi menjadi kabur | `window` kehilangan fokus | seluruh halaman |
| Isi menjadi kabur | tab disembunyikan (`visibilitychange`) | seluruh halaman |
| Isi menjadi kabur | kursor keluar area artikel, jeda 400 ms | wadah artikel, hanya perangkat bertetikus |
| Isi jernih kembali | fokus pulih, tab tampak, kursor masuk, atau tombol gulir ditekan | |
| Petunjuk saat kabur | selalu, saat kabur | di luar lapisan yang dikaburkan |
| Klik kanan diblokir | `contextmenu` | **wadah artikel saja** |
| Seret gambar diblokir | `dragstart` | **wadah artikel saja** |
| Salin diblokir | `copy` | **wadah artikel saja** |
| Ctrl+U, S, P, A dan F12, Ctrl+Shift+I/J/C diblokir | `keydown` | seluruh halaman, kecuali saat mengetik di input/textarea |
| Teks tidak dapat diseleksi | `user-select: none` | wadah artikel |
| Clipboard ditimpa teks | `keyup` PrintScreen | seluruh halaman, Chrome saja |
| Watermark email pembaca | selalu, tidak ikut kabur | setinggi wadah artikel |
| Isi hilang saat dicetak | `@media print` | seluruh wadah, watermark ikut hilang |

Tahap 3 berlaku untuk **semua artikel**, bukan hanya premium. Ini keputusan
sadar pemilik proyek. Bila kelak terasa mengganggu pembaca artikel gratis,
membatasinya cukup dengan menambah prop `ketat={article.isPremium}` dan
menjadikan efek `mouseleave` bergantung padanya.

---

## 3. Dua Keputusan Rancangan yang Perlu Diketahui

Keduanya tidak terlihat dari membaca kode sekilas, tetapi mudah dirusak oleh
perubahan yang kelihatannya sepele.

### Kabur disimpan sebagai himpunan alasan, bukan satu boolean

```tsx
type Alasan = 'fokus' | 'tab' | 'tetikus';
const [alasan, setAlasan] = useState<ReadonlySet<Alasan>>(new Set());
const kabur = alasan.size > 0;
```

Ada tiga sumber yang bisa mengaburkan secara bersamaan. Dengan satu boolean,
sumber yang satu akan menjernihkan layar padahal sumber lain masih menghendaki
kabur. Contoh nyatanya: pembaca kembali dari tab lain dengan kursor mendarat di
dalam artikel, `mouseenter` memanggil `setBlurred(false)` padahal jendela belum
tentu sudah mendapat fokus. Jangan menyederhanakannya kembali menjadi boolean.

### Tiga event dipasang di wadah, bukan di `document`

`contextmenu`, `dragstart`, dan `copy` dipasang lewat prop React pada div
pembungkus. Versi sebelumnya memasangnya di `document`, dan akibatnya klik kanan
mati di seluruh halaman, termasuk di kotak komentar
(`src/components/ui/CommentSection.tsx`, ada `<textarea>` di dalamnya).

`keydown` masih di `document` karena pintasan seperti F12 dan Ctrl+U memang
tidak terikat elemen mana pun, tetapi handler-nya berhenti lebih dulu bila
sasarannya `INPUT`, `TEXTAREA`, `SELECT`, atau contenteditable. Ctrl+C sengaja
tidak ada di daftar blokir: `user-select: none` sudah menghalangi seleksi teks
artikel, jadi memblokirnya secara global hanya mematikan salin-tempel di kotak
komentar tanpa menambah perlindungan apa pun.

### Catatan pendukung

- **Tahap 3 hanya aktif pada perangkat bertetikus**, dijaga
  `matchMedia('(hover: hover) and (pointer: fine)')`. Di layar sentuh, ketukan
  menghasilkan `mouseenter` dan `mouseleave` tiruan yang mengaburkan artikel
  tanpa sebab.
- **Tombol panah, PageUp/PageDown, Home/End, dan spasi menghapus alasan
  `tetikus`.** Tanpa ini, pembaca yang menggulir dengan papan ketik dan tidak
  menyentuh tetikus sama sekali akan terkunci pada layar kabur permanen, karena
  `mouseenter` tidak akan pernah terpicu.
- **Jeda 400 ms (`JEDA_KELUAR_MS`)** menahan kabur saat kursor cuma melintas ke
  bilah gulir atau ke iklan samping. Naikkan angkanya bila masih berkedip.
- **Lapisan petunjuk memakai `pointer-events-none`.** Tanpa itu, lapisan yang
  menutupi seluruh area justru menghadang klik, padahal petunjuknya sendiri
  berbunyi "klik halaman ini".

---

## 4. Yang Belum Dikerjakan

### Pencatatan pelanggaran (opsional)

Ini yang membuat sistem ujian kampus terasa tegas. Alurnya:

1. Saat terdeteksi kehilangan fokus atau perpindahan tab, kirim `POST` ke API,
   misalnya `/articles/{id}/protection-event`, berisi jenis kejadian dan waktu.
2. API mencatatnya ke tabel baru, misalnya `content_protection_events`.
3. Admin dapat melihat rekapnya, dan akun yang mencurigakan dapat ditindak.

**Belum ada endpoint ini di API.** Perlu dibuat: migrasi Phinx untuk tabelnya,
controller, dan rute. Batasi lajunya (rate limit) supaya tidak dibanjiri, karena
event ini bisa terpicu puluhan kali dalam satu sesi baca yang wajar. Dengan
Tahap 3 aktif, lajunya jauh lebih tinggi lagi: kursor keluar-masuk area artikel
puluhan kali dalam pembacaan biasa, jadi kejadian `tetikus` sebaiknya tidak
ikut dikirim, atau dikirim sebagai ringkasan di akhir sesi.

Nilai sesungguhnya ada pada tindak lanjutnya. Mencatat tanpa pernah menindak
sama saja dengan tidak mencatat.

---

## 5. Hal yang Perlu Ditimbang

**Tahap 3 berlaku untuk semua artikel.** Pembaca yang memarkir tetikus di tepi
layar akan melihat artikel kabur terus sampai kursor masuk kembali atau mereka
menekan tombol gulir. Bila keluhan ini muncul, batasi ke artikel premium.

**Blokir papan ketik masih cukup luas.** Ctrl+A ikut mematikan kebiasaan wajar
di luar kotak isian. Padahal orang yang benar-benar berniat menyalin tidak
terhalang sama sekali, cukup buka View Page Source.

**`user-select: none` menyulitkan pembaca dengan keterbatasan.** Sebagian
pembantu baca layar dan penerjemah dalam peramban bergantung pada seleksi teks.

**`filter: blur()` membuat elemen menjadi containing block.** Filter sekarang
dipasang pada lapisan isi di dalam wadah, bukan pada wadah terluar. Bila kelak
ada anak elemen dengan `position: fixed` di dalam lapisan itu, posisinya akan
kacau.

**Iklan bisa memicu kabur palsu.** `src/components/ui/AdSlot.tsx` menyuntik HTML
mentah lewat `dangerouslySetInnerHTML`. Bila kelak diisi skrip iklan yang
membuat iframe, klik ke iframe merebut fokus jendela dan artikel ikut kabur.

**Blur hanya efek CSS.** Siapa pun yang membuka Developer Tools dapat menghapus
properti `filter` dan isinya kembali terbaca seketika. Jangan menganggapnya
lapisan keamanan.

---

## 6. Daftar Uji

Belum dijalankan di peramban. Jalankan setelah deploy atau di lokal dengan
`npm run dev -- --webpack`.

Yang tercentang di bawah diperiksa pada 7 Agustus 2026 di Chrome, langsung pada
situs terpasang `devsasmita.arifsuwadji.net`, lewat otomasi peramban. Sisanya
belum pernah dijalankan.

- [ ] Pindah ke tab lain, isi menjadi kabur
- [ ] Kembali ke tab, isi jernih lagi
- [x] Klik jendela aplikasi lain, isi menjadi kabur
- [ ] Petunjuk terbaca jelas, tidak ikut kabur
- [ ] Klik pada lapisan petunjuk tetap tembus ke halaman
- [x] Kursor keluar area artikel, isi kabur setelah kira-kira setengah detik
- [ ] Kursor melintas cepat ke bilah gulir, isi tidak berkedip
- [ ] Gulir dengan tombol panah tanpa menyentuh tetikus, isi tetap terbaca
- [ ] Klik kanan di kotak komentar tetap berfungsi
- [ ] Ctrl+A dan Ctrl+C di kotak komentar tetap berfungsi
- [ ] Iklan di sisi kiri dan kanan tidak ikut kabur
- [ ] Klik iklan yang membuka tab baru, isi kabur lalu jernih saat kembali
- [ ] Artikel premium yang terkunci tetap menampilkan kotak ajakan berlangganan
- [ ] Di layar sentuh, ketukan tidak membuat artikel kabur
- [ ] Cetak halaman, tidak ada isi dan tidak ada watermark yang tertinggal
- [ ] Halaman tetap dapat dibaca pembantu baca layar
- [ ] Tekan PrintScreen lalu tempel ke Paint, yang muncul teks penanda
- [x] Watermark tetap tajam dan terbaca saat isi artikel kabur
- [x] Watermark menutup sampai bagian bawah artikel yang panjang
- [ ] Konsol tidak memunculkan galat clipboard di Firefox

Catatan dari pemeriksaan itu, supaya tidak diulang dari nol:

- **Kedua artikel di situs terpasang pendek**, 464 px dan 559 px, sehingga batas
  bawah 8 baris sudah menutupinya dan jalur `ResizeObserver` tidak tersentuh.
  Untuk mengujinya, sisipkan sementara elemen setinggi 2400 px ke dalam
  `.content-protected` lewat konsol. Hasilnya wadah 2864 px menghasilkan 25
  baris dengan jangkauan 2920 px.
- **Kotak petunjuk tidak muncul pada tangkapan layar** meski DOM menyatakan
  elemennya ada di posisi yang benar. Dua tangkapan berturut-turut identik
  piksel demi piksel, jadi kemungkinan besar Chrome menyajikan frame basi karena
  jendelanya tidak sedang fokus. Perlu dilihat dengan mata sendiri, bukan lewat
  otomasi.
- **Butir "pindah ke tab lain" belum dapat dipastikan.** Saat `document.hidden`
  bernilai `true`, teks petunjuk masih berbunyi "Arahkan kursor ke artikel",
  padahal semestinya berganti menjadi "Klik halaman ini". Render React memang
  dihambat pada tab tersembunyi, jadi ini belum tentu cacat, tetapi belum
  terjawab.
- **Perekaman konsol baru mulai saat alat dipanggil.** Galat pada saat halaman
  dimuat bisa terlewat. Muat ulang halaman lebih dulu sebelum membaca konsol.
- **Watermark yang teruji baru varian tamu**, yaitu teks "SASMITA.COM". Varian
  yang menampilkan email pembaca perlu diuji dengan akun yang sudah masuk.

---

## 7. Yang Sebaiknya Tidak Dikejar

- **Memblokir PrintScreen.** Itu tombol sistem operasi. `preventDefault` tidak
  menghentikannya. Penanganan lewat `keydown` yang dulu ada bahkan tidak pernah
  berjalan, karena Windows hanya mengirim `keyup` untuk tombol itu ke peramban.
  Sudah dihapus, jangan dipasang kembali. Yang ada sekarang bukan blokir,
  melainkan penimpaan clipboard setelah kejadian, lihat bagian 8.
- **Memblokir pintasan aplikasi perekam layar, misalnya Alt+P milik Lightshot
  atau Win+Shift+S milik Snipping Tool.** Aplikasi seperti itu mendaftarkan
  hotkey global ke Windows lewat `RegisterHotKey`, jadi kombinasinya dicegat
  sistem operasi dan halaman sering tidak menerima `keydown`-nya sama sekali.
  Sekalipun menerima, `preventDefault` hanya membatalkan tindakan bawaan
  peramban, bukan tindakan aplikasi lain.
- **Mendeteksi Developer Tools terbuka.** Semua caranya berupa tebakan yang
  mudah salah, dan sering salah menuduh pembaca biasa.
- **Mengaburkan lewat gambar atau kanvas.** Membuat artikel tidak dapat dicari
  mesin pencari, tidak dapat dibaca pembantu baca layar, dan tetap dapat direkam.
- **Menonaktifkan tangkapan layar.** Tidak ada API peramban untuk itu. Yang ada
  hanya pada aplikasi native, misalnya `FLAG_SECURE` di Android.

---

## 8. Hasil Uji Peramban, 7 Agustus 2026

Dua temuan dilaporkan dari pengujian di Chrome pada Windows:

1. PrintScreen tetap berfungsi saat kursor berada di dalam artikel.
2. Alt+P tetap memanggil Lightshot.

**Keduanya bukan cacat.** Sudah dijelaskan di bagian 7 mengapa tidak dapat
dicegah dari halaman web. Ringkasnya, PrintScreen disalin sistem operasi ke
clipboard sebelum satu baris JavaScript pun berjalan, sedangkan Alt+P dicegat
Windows dan diserahkan ke Lightshot tanpa melewati Chrome. Lightshot kemudian
membekukan salinan layar lalu menampilkan lapisannya sendiri, jadi mengaburkan
halaman sesudahnya tidak mengubah gambar yang sudah tertangkap.

Dua penyesuaian dikerjakan sebagai tanggapan. Keduanya mengurangi kerugian,
bukan mencegah kejadiannya.

### Penimpaan clipboard setelah PrintScreen

Pada `keyup` dengan `e.key === 'PrintScreen'`, isi clipboard ditimpa teks
`TEKS_PENGGANTI_CLIPBOARD`. Gambar layarnya sudah terlanjur diambil, yang
dipatahkan hanyalah alur tekan PrtScn lalu tempel ke Paint atau Word.

Batasnya perlu diketahui sebelum menaruh harapan padanya:

- **Chrome saja.** `navigator.clipboard.writeText` di Firefox dan Safari
  menuntut gerak-gerik pengguna, dan `keyup` tidak dihitung sebagai gerak-gerik.
  Panggilannya sengaja dibungkus `.catch(() => {})` supaya gagal diam-diam di
  sana, bukan melempar galat ke konsol.
- **Tidak berlaku untuk Lightshot, Snipping Tool, dan perekam layar lain.**
  Aplikasi itu menyimpan gambarnya sendiri ke berkas atau ke penyimpanannya
  sendiri, tidak menunggu clipboard sistem.
- **Hanya berjalan bila jendela Chrome sedang mendapat fokus**, karena halaman
  tidak menerima `keyup` apa pun saat tidak fokus.
- **Menimpa apa pun yang sedang dipegang pembaca di clipboard.** Bila mereka
  baru saja menyalin sesuatu dari aplikasi lain, salinan itu hilang.

### Watermark tidak lagi ikut dikaburkan

Sebelumnya lapisan watermark berada di dalam elemen yang diberi `filter: blur()`,
sehingga ikut kabur. Akibatnya tangkapan layar yang diambil saat halaman kabur,
yaitu keadaan yang paling mungkin terjadi ketika perekam layar sedang aktif,
justru tidak membawa penanda pemiliknya sama sekali. Sekarang lapisannya
dipindahkan menjadi saudara dari lapisan isi, di luar jangkauan filter.

Dua perubahan lain menyertainya:

- Opasitas dinaikkan dari `text-tinta-300/20` menjadi `text-tinta-500/25`.
  Yang lama praktis tidak terbaca pada latar putih, jadi tidak berguna untuk
  melacak siapa yang membocorkan.
- Jumlah barisnya mengikuti tinggi wadah lewat `ResizeObserver`, bukan lagi
  tetap 8 baris. Dengan 8 baris, artikel yang lebih panjang dari kira-kira
  960 piksel tidak tertandai sama sekali di bagian bawahnya.

### Yang tetap tidak berubah

Perlindungan yang sesungguhnya untuk karya berbayar tetap `PremiumAccessPolicy`
di repositori API. Naskah premium memang tidak pernah dikirim ke pembaca tanpa
langganan, jadi tidak ada yang bisa ditangkap layar. Semua yang ada di berkas
ini adalah penghalang bagi pembaca biasa dan penanda bahwa isi ini dijaga.
