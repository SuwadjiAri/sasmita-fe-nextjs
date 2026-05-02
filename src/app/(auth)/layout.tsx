import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center justify-center w-full p-16 text-white text-center">
          <Link href="/" className="mb-8 hover:opacity-90 transition-opacity">
            <img
              src="/logo-sasmita.png"
              alt="SASMITA.com"
              width={1048}
              height={225}
              className="h-14 w-auto brightness-0 invert"
            />
          </Link>
          <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
            Platform Literasi Digital Karya Sastra dan Akademik Mahasiswa
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
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
