import type { Metadata } from 'next';
import { BookMarked, Scale, Copyright, AlertCircle, FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan',
  description: 'Syarat dan ketentuan layanan serta etika publikasi sastra di SMITA.ID.',
};

export default function TermsPage() {
  return (
    <div className="bg-latar min-h-screen">
      {/* Header Halaman */}
      <header className="border-b border-tinta-200/70 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="label-mikro text-emas-700">Etika Publikasi & Regulasi Portal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-tinta-900 sm:text-4xl">
            Syarat dan Ketentuan Layanan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg leading-relaxed text-tinta-600">
            Panduan resmi dan ketentuan hukum penggunaan platform literasi digital SMITA.ID bagi penulis dan pembaca.
          </p>
          <p className="mt-3 text-xs text-tinta-400">
            Terakhir diperbarui: 15 Oktober 2026
          </p>
        </div>
      </header>

      {/* Isi Syarat dan Ketentuan */}
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="space-y-10">

          {/* 1. Ketentuan Umum */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <Scale className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">1. Ketentuan Umum</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                Dengan mengakses atau menggunakan platform <strong>SMITA.ID</strong> (<code>https://smita.id</code>), Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat secara hukum oleh Syarat dan Ketentuan ini.
              </p>
              <p>
                Layanan ini diselenggarakan oleh <strong>Sarana Media Informasi dan Sastra</strong> sebagai ruang berekspresi, membaca, berdiskusi, serta menerbitkan karya sastra berkualitas.
              </p>
            </div>
          </section>

          {/* 2. Hak Cipta & Kepemilikan Karya Sastra */}
          <section className="rounded-2xl border border-emas-300 bg-gradient-to-br from-white to-amber-50/20 p-8 shadow-xs ring-1 ring-emas-300/40">
            <div className="flex items-center gap-3 border-b border-emas-200/80 pb-4">
              <Copyright className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">2. Hak Cipta & Kepemilikan Karya</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                <strong>Hak Cipta Tetap Milik Penulis:</strong> Seluruh hak moral dan hak cipta naskah sastra (opini, esai, puisi, cerpen, novel, dan resensi) sepenuhnya tetap berada pada penulis yang bersangkutan.
              </p>
              <p>
                <strong>Lisensi Publikasi Digital:</strong> Dengan mengirimkan karya ke SMITA.ID, penulis memberikan lisensi non-eksklusif dan bebas royalti kepada SMITA.ID untuk menayangkan, mengarsipkan, membagikan cuplikan, dan mendistribusikan karya secara digital di jaringan platform kami.
              </p>
              <p>
                <strong>Orisinalitas Naskah:</strong> Penulis menjamin bahwa setiap naskah yang dikirimkan adalah karya asli pribadi, bukan hasil plagiasi, saduran tanpa izin, maupun hasil generasi kecerdasan buatan tanpa proses kreasi otentik. Penulis bertanggung jawab penuh secara hukum atas segala klaim hak cipta dari pihak ketiga.
              </p>
            </div>
          </section>

          {/* 3. Kebijakan Kurasi & Hak Redaksi */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <BookMarked className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">3. Kewenangan Kurasi Dewan Redaksi</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                Tim kurator dan Dewan Redaksi SMITA.ID memiliki hak independen untuk meninjau, menyetujui, meminta revisi, atau menolak setiap naskah yang masuk berdasarkan standar mutu estetika sastra dan kepatuhan hukum.
              </p>
              <p>
                Dewan Redaksi berhak menyunting judul, tata bahasa, ejaan (sesuai EYD V), dan tata letak tanpa mengubah pesan esensial dari karya penulis demi menjaga keselarasan artistik portal.
              </p>
            </div>
          </section>

          {/* 4. Larangan & Konten Terlarang */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              <h2 className="text-xl font-semibold text-tinta-900">4. Larangan Konten & Etika Berkomentar</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>Pengguna dilarang mengunggah materi atau melontarkan komentar yang memuat:</p>
              <ul className="list-disc space-y-2 pl-5 text-tinta-700">
                <li>Ujaran kebencian, fitnah, pencemaran nama baik, atau diskriminasi berbasis SARA.</li>
                <li>Pornografi, kekerasan ekstrem, atau pelanggaran terhadap kesusilaan publik.</li>
                <li>Tautan spam, materi promosi ilegal, skema penipuan, atau peretasan keamanan digital.</li>
              </ul>
              <p>
                Pengelola berhak menghapus akun dan menghapus konten pengguna yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya.
              </p>
            </div>
          </section>

          {/* 5. Transaksi, Langganan & Perubahan Syarat */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <FileCheck className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">5. Ketentuan Pembayaran & Perubahan Ketentuan</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-tinta-700">
              <p>
                Pembelian paket langganan atau dukungan karya sastra diproses melalui mitra gerbang pembayaran resmi. Pembayaran yang telah berhasil terverifikasi bersifat final dan tidak dapat dikembalikan kecuali terjadi kendala teknis dari pihak pengelola.
              </p>
              <p>
                SMITA.ID berhak memperbarui Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan berlaku efektif setelah diumumkan pada halaman ini.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
