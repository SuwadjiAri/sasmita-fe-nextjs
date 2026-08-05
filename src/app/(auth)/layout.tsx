import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sisi kiri, hanya tampil pada layar lebar. */}
      <div className="relative hidden overflow-hidden bg-tinta-950 lg:flex lg:w-1/2">
        <div
          className="absolute inset-0 opacity-[0.18]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 20%, #c08d3c 0, transparent 45%), radial-gradient(circle at 75% 85%, #465e80 0, transparent 45%)',
          }}
        />

        <div className="relative flex w-full flex-col justify-between p-14 text-white">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <img
              src="/logo-sasmita.png"
              alt="SASMITA.com"
              width={1048}
              height={225}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          <div className="max-w-md">
            <p className="label-mikro text-emas-300">Platform Literasi Digital</p>
            <p className="mt-5 font-serif text-2xl leading-snug">
              Ruang terbit untuk puisi, cerpen, esai, novel, resensi, dan artikel
              akademik mahasiswa.
            </p>
          </div>

          <p className="text-sm text-tinta-400">
            Program Studi Sastra Indonesia, Universitas Pamulang
          </p>
        </div>
      </div>

      {/* Sisi kanan, formulir. */}
      <div className="flex flex-1 items-center justify-center bg-kertas px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-block">
              <img
                src="/logo-sasmita.png"
                alt="SASMITA.com"
                width={1048}
                height={225}
                className="h-9 w-auto"
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
