import Link from 'next/link';
import { PenLine } from 'lucide-react';

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
          <Link href="/" className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 hover:bg-white/30 transition-colors">
            <PenLine className="w-8 h-8" />
          </Link>
          <Link href="/" className="text-4xl font-bold mb-4 hover:text-indigo-200 transition-colors">SASMITA.COM</Link>
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
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <PenLine className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">SASMITA</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
