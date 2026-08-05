import { Wrench } from 'lucide-react';

// Tampil saat NEXT_PUBLIC_DEV_MODE bernilai "true", lihat src/config/site.ts.
export default function DevelopmentScreen() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-tinta-950 px-4 text-center text-white">
      <div
        className="absolute inset-0 opacity-[0.18]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #c08d3c 0, transparent 45%), radial-gradient(circle at 80% 80%, #465e80 0, transparent 45%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-lg">
        <img
          src="/logo-sasmita.png"
          alt="SASMITA.com"
          width={1048}
          height={225}
          className="mx-auto mb-10 h-10 w-auto brightness-0 invert"
        />

        <span className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06]">
          <Wrench className="h-8 w-8 text-emas-300" />
        </span>

        <h1 className="mb-4 text-3xl font-semibold md:text-4xl">Sedang Dalam Pengembangan</h1>
        <p className="text-lg leading-relaxed text-tinta-300">
          Situs ini sedang kami persiapkan. Mohon maaf atas ketidaknyamanannya,
          kami akan segera kembali.
        </p>
      </div>

      <p className="absolute inset-x-0 bottom-6 z-10 text-sm text-tinta-500">
        &copy; {new Date().getFullYear()} SASMITA.COM
      </p>
    </div>
  );
}
