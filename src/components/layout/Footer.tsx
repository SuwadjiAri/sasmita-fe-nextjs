import Link from 'next/link';
import { PenLine, BookOpen, Search, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <PenLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SASMITA.COM</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Platform Literasi Digital Karya Sastra dan Akademik Mahasiswa
              — Prodi Sastra Indonesia, Universitas Pamulang.
              Tempat menulis, membaca, dan berbagi karya sastra.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" />Beranda</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" />Kategori</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors flex items-center gap-2"><Search className="w-3.5 h-3.5" />Cari Artikel</Link></li>
              <li><Link href="/subscription" className="hover:text-white transition-colors flex items-center gap-2"><CreditCard className="w-3.5 h-3.5" />Langganan</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Kategori</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/categories/puisi" className="hover:text-white transition-colors">Puisi</Link></li>
              <li><Link href="/categories/cerpen" className="hover:text-white transition-colors">Cerpen</Link></li>
              <li><Link href="/categories/esai" className="hover:text-white transition-colors">Esai</Link></li>
              <li><Link href="/categories/novel" className="hover:text-white transition-colors">Novel</Link></li>
              <li><Link href="/categories/resensi" className="hover:text-white transition-colors">Resensi</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} SASMITA.COM — Project Work Universitas Pamulang</p>
        </div>
      </div>
    </footer>
  );
}
