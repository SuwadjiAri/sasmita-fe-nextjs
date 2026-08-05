'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import { Search, BookOpen, CreditCard, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

const menu = [
  { href: '/', label: 'Beranda', icon: null },
  { href: '/categories', label: 'Kategori', icon: BookOpen },
  { href: '/search', label: 'Cari', icon: Search },
  { href: '/subscription', label: 'Langganan', icon: CreditCard },
];

export default function Navbar() {
  const { user, logout, loadUser } = useAuthStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    loadUser();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadUser]);

  const aktif = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className={`sticky top-0 z-50 bg-tinta-950 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_0_rgba(255,255,255,0.08),0_10px_30px_-20px_rgba(0,0,0,0.9)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/logo-sasmita.png"
              alt="SASMITA.com"
              width={1048}
              height={225}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>

          {/* Menu layar lebar */}
          <div className="hidden md:flex items-center gap-1">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                  aktif(item.href)
                    ? 'text-white'
                    : 'text-tinta-300 hover:text-white'
                }`}
              >
                {item.icon ? <item.icon className="w-4 h-4" /> : null}
                {item.label}
                {/* Penanda halaman aktif, garis emas tipis di bawah label. */}
                {aktif(item.href) && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-emas-400" />
                )}
              </Link>
            ))}

            <span className="w-px h-5 bg-white/15 mx-3" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg p-2 text-tinta-400 transition-colors hover:bg-white/5 hover:text-white"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-3 py-2 text-sm text-tinta-300 transition-colors hover:text-white">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-emas-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emas-800"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden rounded-lg p-2 text-white transition-colors hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu layar sempit */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors ${
                  aktif(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-tinta-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon ? <item.icon className="w-4 h-4" /> : null}
                {item.label}
              </Link>
            ))}

            <hr className="border-white/10 my-2" />

            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 font-medium text-white" onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-tinta-300 transition-colors hover:bg-white/5 hover:text-white">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block rounded-lg px-4 py-2.5 text-tinta-300 hover:bg-white/5 hover:text-white" onClick={() => setMenuOpen(false)}>Masuk</Link>
                <Link href="/register" className="block rounded-lg bg-emas-700 px-4 py-2.5 text-center font-semibold text-white" onClick={() => setMenuOpen(false)}>Daftar</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
