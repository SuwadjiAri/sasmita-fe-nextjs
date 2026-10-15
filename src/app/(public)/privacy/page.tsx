import type { Metadata } from 'next';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi portal literasi dan sastra digital SMITA.ID.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-latar min-h-screen">
      {/* Header Halaman */}
      <header className="border-b border-tinta-200/70 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="label-mikro text-emas-700">Kepatuhan & Keamanan Data</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-tinta-900 sm:text-4xl">
            Kebijakan Privasi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg leading-relaxed text-tinta-600">
            Komitmen SMITA.ID dalam menjaga kerahasiaan dan privasi data setiap pembaca, penulis, serta pengunjung portal.
          </p>
          <p className="mt-3 text-xs text-tinta-400">
            Terakhir diperbarui: 15 Oktober 2026
          </p>
        </div>
      </header>

      {/* Isi Kebijakan Privasi */}
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="space-y-10">

          {/* 1. Pengantar */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <Shield className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">1. Pendahuluan</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                Selamat datang di <strong>SMITA.ID</strong>, platform literasi digital yang dikelola di bawah naungan <strong>Sarana Media Informasi dan Sastra</strong>. Kami menghargai privasi setiap pengguna dan berkomitmen melindungi informasi pribadi yang Anda percayakan saat mengakses layanan kami di <code>https://smita.id</code>.
              </p>
              <p>
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, serta melindungi data Anda saat membaca karya, mengirimkan naskah sastra, maupun bertransaksi di portal kami.
              </p>
            </div>
          </section>

          {/* 2. Informasi yang Dikumpulkan */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <Eye className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">2. Informasi yang Kami Kumpulkan</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>Kami mengumpulkan beberapa jenis informasi guna menunjang operasional portal:</p>
              <ul className="list-disc space-y-2 pl-5 text-tinta-700">
                <li>
                  <strong>Informasi Akun:</strong> Nama, alamat email, foto profil, dan biodata penulis saat Anda mendaftar melalui akun Google atau formulir registrasi.
                </li>
                <li>
                  <strong>Karya & Kontribusi:</strong> Naskah opini, esai, puisi, cerpen, novel, dan resensi yang Anda kirimkan untuk proses kurasi redaksi.
                </li>
                <li>
                  <strong>Data Transaksi:</strong> Riwayat pembayaran langganan atau apresiasi karya yang diproses secara aman melalui gerbang pembayaran Midtrans tanpa menyimpan nomor kartu kredit secara langsung.
                </li>
                <li>
                  <strong>Data Log & Teknis:</strong> Alamat protokol internet (IP), tipe peramban, zona waktu, durasi sesi baca, dan halaman yang dikunjungi.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Google Analytics & Cookie */}
          <section className="rounded-2xl border border-emas-300 bg-gradient-to-br from-white to-amber-50/20 p-8 shadow-xs ring-1 ring-emas-300/40">
            <div className="flex items-center gap-3 border-b border-emas-200/80 pb-4">
              <CheckCircle2 className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">3. Google Analytics & Cookie</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                SMITA.ID menggunakan <strong>Google Analytics 4 (GA4)</strong>, layanan analisis web dari Google LLC, untuk memahami interaksi pembaca dan meningkatkan kualitas penyajian karya sastra.
              </p>
              <p>
                Google Analytics menggunakan <em>cookies</em>, yaitu berkas teks kecil yang disimpan pada peramban Anda, untuk mengumpulkan data statistik anonim seperti halaman artikel terpopuler, durasi baca naskah, dan sumber lalu lintas pengunjung. Informasi ini tidak digunakan untuk mengidentifikasi pembaca secara pribadi.
              </p>
              <p>
                Anda dapat menonaktifkan penggunaan cookie melalui pengaturan peramban masing-masing atau menggunakan Google Analytics Opt-out Browser Add-on.
              </p>
            </div>
          </section>

          {/* 4. Iklan Pihak Ketiga & Google AdSense */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <FileText className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">4. Penayangan Iklan Digital (Google AdSense)</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                Kami dapat menayangkan iklan melalui mitra periklanan pihak ketiga, termasuk <strong>Google AdSense</strong>, untuk mendukung keberlanjutan operasional platform literasi ini:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-tinta-700">
                <li>
                  Vendor pihak ketiga, termasuk Google, menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan pengguna sebelumnya ke situs web ini atau situs web lain di internet.
                </li>
                <li>
                  Penggunaan cookie periklanan oleh Google memungkinkan penayangan iklan yang relevan kepada pengguna berdasarkan kunjungan ke SMITA.ID dan/atau situs lainnya.
                </li>
                <li>
                  Pengguna dapat memilih tidak menggunakan iklan yang dipersonalisasi dengan mengunjungi Setelan Iklan Google (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emas-700 underline hover:text-emas-800">adssettings.google.com</a>).
                </li>
              </ul>
            </div>
          </section>

          {/* 5. Keamanan Data & Kontak */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <Lock className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">5. Keamanan Data & Kontak Pengelola</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                Kami menerapkan standar pengamanan data melalui protokol enkripsi TLS/HTTPS dan akses basis data terproteksi. Data Anda tidak akan diperjualbelikan kepada pihak luar mana pun.
              </p>
              <p>
                Apabila Anda memiliki pertanyaan, permohonan koreksi, atau penghapusan data akun, silakan hubungi tim redaksi kami melalui:
              </p>
              <div className="mt-4 rounded-xl border border-tinta-100 bg-latar/40 p-4 text-xs text-tinta-800 space-y-1">
                <p><strong>Sarana Media Informasi dan Sastra (SMITA.ID)</strong></p>
                <p>Jl Raya Puspitek Buaran No 46 Kecamatan Serpong, Kota Tangerang Selatan - Banten 15316</p>
                <p>Surel Resmi: <code>redaksi@smita.id</code> | <code>admin@smita.id</code></p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
