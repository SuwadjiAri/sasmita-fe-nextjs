import { Wrench } from 'lucide-react';

/**
 * Halaman penuh yang ditampilkan saat situs dalam mode pengembangan.
 * Aktif ketika env var NEXT_PUBLIC_DEV_MODE bernilai "true" (lihat src/config/site.ts).
 */
export default function DevelopmentScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white px-4 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        <img
          src="/logo-sasmita.png"
          alt="SASMITA.com"
          width={1048}
          height={225}
          className="h-10 w-auto mx-auto mb-10 brightness-0 invert"
        />

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm mb-8">
          <Wrench className="w-10 h-10" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Sedang Dalam Pengembangan
        </h1>
        <p className="text-lg text-indigo-100 leading-relaxed">
          Situs ini sedang kami persiapkan. Mohon maaf atas ketidaknyamanannya —
          kami akan segera kembali!
        </p>
      </div>

      <p className="absolute bottom-6 left-0 right-0 z-10 text-sm text-indigo-200/70">
        © {new Date().getFullYear()} SASMITA.COM
      </p>
    </div>
  );
}
