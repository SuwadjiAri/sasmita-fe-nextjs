'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import { Search, BookOpen, CreditCard, LayoutDashboard, LogOut, Menu, X, PenLine } from 'lucide-react';

export default function Navbar() {
  const { user, logout, loadUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    loadUser();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadUser]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg' : 'bg-gradient-to-r from-slate-900 to-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <PenLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SASMITA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
              Beranda
            </Link>
            <Link href="/categories" className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Kategori
            </Link>
            <Link href="/search" className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Cari
            </Link>
            <Link href="/subscription" className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              Langganan
            </Link>

            <span className="w-px h-6 bg-white/20 mx-2" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-all"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                  Masuk
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            <Link href="/" className="block px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all" onClick={() => setMenuOpen(false)}>Beranda</Link>
            <Link href="/categories" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all" onClick={() => setMenuOpen(false)}><BookOpen className="w-4 h-4" />Kategori</Link>
            <Link href="/search" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all" onClick={() => setMenuOpen(false)}><Search className="w-4 h-4" />Cari</Link>
            <Link href="/subscription" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all" onClick={() => setMenuOpen(false)}><CreditCard className="w-4 h-4" />Langganan</Link>
            <hr className="border-white/10 my-2" />
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white bg-white/10 font-medium" onClick={() => setMenuOpen(false)}><LayoutDashboard className="w-4 h-4" />Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-red-400 hover:bg-white/10 transition-all"><LogOut className="w-4 h-4" />Keluar</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white" onClick={() => setMenuOpen(false)}>Masuk</Link>
                <Link href="/register" className="block px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-medium" onClick={() => setMenuOpen(false)}>Daftar</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
