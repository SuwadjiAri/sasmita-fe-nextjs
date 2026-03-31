'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import { Search, BookOpen, CreditCard, LayoutDashboard, LogOut, Menu, X, PenLine } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

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
      scrolled ? 'glass border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm' : 'bg-white/95 dark:bg-slate-900/95 border-b border-gray-100 dark:border-gray-800'
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
            <Link href="/" className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all text-sm font-medium">
              Beranda
            </Link>
            <Link href="/categories" className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all text-sm font-medium flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Kategori
            </Link>
            <Link href="/search" className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all text-sm font-medium flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              Cari
            </Link>
            <Link href="/subscription" className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all text-sm font-medium flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              Langganan
            </Link>

            <ThemeToggle />
            <span className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all text-sm font-medium">
                  Masuk
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            <Link href="/" className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all" onClick={() => setMenuOpen(false)}>Beranda</Link>
            <Link href="/categories" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all" onClick={() => setMenuOpen(false)}><BookOpen className="w-4 h-4" />Kategori</Link>
            <Link href="/search" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all" onClick={() => setMenuOpen(false)}><Search className="w-4 h-4" />Cari</Link>
            <Link href="/subscription" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all" onClick={() => setMenuOpen(false)}><CreditCard className="w-4 h-4" />Langganan</Link>
            <hr className="border-gray-100 my-2" />
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-indigo-600 bg-indigo-50 font-medium" onClick={() => setMenuOpen(false)}><LayoutDashboard className="w-4 h-4" />Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all"><LogOut className="w-4 h-4" />Keluar</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Masuk</Link>
                <Link href="/register" className="block px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-medium" onClick={() => setMenuOpen(false)}>Daftar</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
