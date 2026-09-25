import { Metadata } from 'next';
import { Mail, MapPin, Award, BookOpen, ShieldCheck, Users, Feather } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Susunan Dewan Redaksi | SASMITA.COM',
  description: 'Susunan Dewan Redaksi dan Pengelola Media Sastra SASMITA.COM Universitas Pamulang.',
};

export default function RedaksiPage() {
  return (
    <div className="bg-latar min-h-screen">
      {/* Header */}
      <header className="border-b border-tinta-200/70 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <p className="label-mikro text-emas-700">Media Sastra & Kurasi Akademik</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-tinta-900 sm:text-4xl">
            Susunan Dewan Redaksi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg leading-relaxed text-tinta-600">
            SASMITA.COM diterbitkan sebagai wadah kurasi, apresiasi, dan publikasi karya sastra
            terkurasi di bawah naungan Program Studi Sastra Indonesia Universitas Pamulang.
          </p>
        </div>
      </header>

      {/* Konten Struktur Redaksi */}
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="space-y-10">
          
          {/* Pembina & Penanggung Jawab */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <ShieldCheck className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">Pelindung & Penanggung Jawab</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="label-mikro text-tinta-500">Pelindung & Pembina</p>
                <p className="mt-1 text-base font-semibold text-tinta-900">Yayasan Sasmita Jaya</p>
                <p className="text-sm text-tinta-600">Rektor Universitas Pamulang</p>
              </div>
              <div>
                <p className="label-mikro text-tinta-500">Penanggung Jawab Institusional</p>
                <p className="mt-1 text-base font-semibold text-tinta-900">Dekan Fakultas Sastra</p>
                <p className="text-sm text-tinta-600">Universitas Pamulang</p>
              </div>
            </div>
          </section>

          {/* Pemimpin Redaksi */}
          <section className="rounded-2xl border border-emas-300 bg-gradient-to-br from-white to-amber-50/30 p-8 shadow-xs ring-1 ring-emas-300/40">
            <div className="flex items-center gap-3 border-b border-emas-200/80 pb-4">
              <Award className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">Pemimpin Redaksi / Penanggung Jawab Redaksi</h2>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tinta-950 font-serif text-2xl font-bold text-emas-300 shadow-sm">
                M
              </div>
              <div>
                <p className="text-xl font-semibold text-tinta-900">
                  Dr. Misbah Priagung Nursalim, S.S., M.Pd.
                </p>
                <p className="text-sm text-tinta-600">
                  Ketua Program Studi Sastra Indonesia — Universitas Pamulang
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emas-800 font-medium">
                  <Mail className="h-3.5 w-3.5" />
                  redaksi@smita.id
                </p>
              </div>
            </div>
          </section>

          {/* Dewan Editor & Kurator */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <BookOpen className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">Dewan Redaksi & Kurator Sastra</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-tinta-100 bg-latar/40 p-4">
                <p className="label-mikro text-emas-700">Kurator Puisi & Cerpen</p>
                <p className="mt-1 font-medium text-tinta-900">Tim Kurator Sastra Kreatif</p>
                <p className="text-xs text-tinta-500">Program Studi Sastra Indonesia Unpam</p>
              </div>
              <div className="rounded-xl border border-tinta-100 bg-latar/40 p-4">
                <p className="label-mikro text-emas-700">Editor Esai & Kritik Sastra</p>
                <p className="mt-1 font-medium text-tinta-900">Dewan Editor Akademik & Resensi</p>
                <p className="text-xs text-tinta-500">Program Studi Sastra Indonesia Unpam</p>
              </div>
            </div>
          </section>

          {/* Redaktur Pelaksana, IT & Kemitraan */}
          <section className="rounded-2xl border border-tinta-200/80 bg-white p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-tinta-100 pb-4">
              <Users className="h-5 w-5 text-emas-700" />
              <h2 className="text-xl font-semibold text-tinta-900">Redaktur Pelaksana, Tata Usaha & Kemitraan</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <p className="label-mikro text-tinta-500">Administrasi & Naskah</p>
                <p className="mt-1 text-sm font-semibold text-tinta-900">Sekretariat Redaksi</p>
                <p className="mt-0.5 text-xs text-tinta-600">Email: admin@smita.id</p>
              </div>
              <div>
                <p className="label-mikro text-tinta-500">Teknis & Tata Rancang</p>
                <p className="mt-1 text-sm font-semibold text-tinta-900">Divisi Teknologi & Tata Rancang</p>
                <p className="mt-0.5 text-xs text-tinta-600">Email: support@smita.id</p>
              </div>
              <div>
                <p className="label-mikro text-tinta-500">Kemitraan & Distribusi</p>
                <p className="mt-1 text-sm font-semibold text-tinta-900">Divisi Marketing & Promosi</p>
                <p className="mt-0.5 text-xs text-tinta-600">Email: marketing@smita.id</p>
              </div>
            </div>
          </section>

          {/* Alamat Sekretariat & Kontak */}
          <section className="rounded-2xl border border-tinta-200/80 bg-tinta-950 p-8 text-white shadow-xs">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <MapPin className="h-5 w-5 text-emas-400" />
              <h2 className="text-xl font-semibold text-white">Alamat Sekretariat & Kontak Resmi</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm text-tinta-300">
              <div>
                <p className="font-semibold text-white">Kantor Redaksi SASMITA</p>
                <p className="mt-1 leading-relaxed">
                  Program Studi Sastra Indonesia, Fakultas Sastra<br />
                  Universitas Pamulang, Kampus 1<br />
                  Jl. Surya Kencana No. 1, Pamulang Barat<br />
                  Tangerang Selatan, Banten 15417
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-white">Layanan Elektronik</p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emas-400 shrink-0" />
                  Redaksi: <a href="mailto:redaksi@smita.id" className="text-white hover:text-emas-300 underline">redaksi@smita.id</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emas-400 shrink-0" />
                  Administrasi: <a href="mailto:admin@smita.id" className="text-white hover:text-emas-300 underline">admin@smita.id</a>
                </p>
                <p className="flex items-center gap-2">
                  <Feather className="h-4 w-4 text-emas-400 shrink-0" />
                  Website Resmi: <a href="https://smita.id" className="text-white hover:text-emas-300 underline">https://smita.id</a>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
