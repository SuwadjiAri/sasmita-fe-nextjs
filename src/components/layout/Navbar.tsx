'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import { Search, BookOpen, CreditCard, LayoutDashboard, LogOut, Menu, X, Users, ChevronDown } from 'lucide-react';

type RubrikItem = {
  slug: string;
  name: string;
  desc: string;
  badge: string;
};

const rubrikDefault: RubrikItem[] = [
  { slug: 'opini', name: 'Opini', desc: 'Opini kritis & wacana sastra', badge: 'Wacana' },
  { slug: 'esai', name: 'Esai', desc: 'Esai sastra & telaah budaya', badge: 'Telaah' },
  { slug: 'cerpen', name: 'Cerpen', desc: 'Cerita pendek sastra pilihan', badge: 'Fiksi' },
  { slug: 'puisi', name: 'Puisi', desc: 'Karya puisi & bait sajak', badge: 'Puitika' },
  { slug: 'resensi', name: 'Resensi', desc: 'Ulasan buku & kritik karya', badge: 'Kritik' },
  { slug: 'novel', name: 'Novel', desc: 'Serial novel & karya bersambung', badge: 'Serial' },
];

function tentukanBadge(slug: string, name: string): string {
  const map: Record<string, string> = {
    opini: 'Wacana',
    esai: 'Telaah',
    cerpen: 'Fiksi',
    puisi: 'Puitika',
    resensi: 'Kritik',
    novel: 'Serial',
  };
  return map[slug.toLowerCase()] || (name.length > 7 ? name.slice(0, 6) : name);
}

export default function Navbar() {
  const { user, logout, loadUser } = useAuthStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rubrikMobileOpen, setRubrikMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [rubrikList, setRubrikList] = useState<RubrikItem[]>(rubrikDefault);

  useEffect(() => {
    loadUser();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadUser]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((json) => {
        if (isMounted && json?.data && Array.isArray(json.data) && json.data.length > 0) {
          const items: RubrikItem[] = json.data.map((cat: { slug: string; name: string; description?: string }) => ({
            slug: cat.slug,
            name: cat.name,
            desc: cat.description || `Rubrik & karya ${cat.name.toLowerCase()}`,
            badge: tentukanBadge(cat.slug, cat.name),
          }));
          setRubrikList(items);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const aktif = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isRubrikAktif = pathname.startsWith('/categories');

  return (
    <nav
      className={`sticky top-0 z-50 bg-tinta-950 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_0_rgba(255,255,255,0.08),0_10px_30px_-20px_rgba(0,0,0,0.9)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Smita.id */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo-smita.png"
              alt="Smita.id"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-contain shadow-md transition-transform group-hover:scale-105"
            />
            <span className="font-serif text-xl font-bold tracking-tight text-white hidden sm:inline-block">
              Smita<span className="text-emas-400">.id</span>
            </span>
          </Link>

          {/* Menu layar lebar */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                aktif('/') ? 'text-white' : 'text-tinta-300 hover:text-white'
              }`}
            >
              Beranda
              {aktif('/') && <span className="absolute inset-x-3 -bottom-px h-px bg-emas-400" />}
            </Link>

            {/* Menu Rubrik dengan Hover Dropdown */}
            <div className="relative group">
              <Link
                href="/categories"
                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                  isRubrikAktif ? 'text-white' : 'text-tinta-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Rubrik</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                {isRubrikAktif && <span className="absolute inset-x-3 -bottom-px h-px bg-emas-400" />}
              </Link>

              {/* Hover Dropdown Panel */}
              <div className="absolute left-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="w-80 rounded-2xl border border-white/10 bg-tinta-950/95 p-3 shadow-2xl backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emas-400">
                      Pilihan Rubrik & Kategori Sastra
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {rubrikList.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                          pathname === `/categories/${cat.slug}`
                            ? 'bg-emas-700/20 text-white'
                            : 'text-tinta-200 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium leading-none">{cat.name}</p>
                          <p className="text-xs text-tinta-400 mt-1">{cat.desc}</p>
                        </div>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/10 text-emas-300">
                          {cat.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 px-2 text-center">
                    <Link
                      href="/categories"
                      className="text-xs text-emas-400 hover:text-emas-300 transition-colors font-medium inline-flex items-center gap-1"
                    >
                      Lihat Semua Rubrik &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/search"
              className={`relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                aktif('/search') ? 'text-white' : 'text-tinta-300 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              Cari
              {aktif('/search') && <span className="absolute inset-x-3 -bottom-px h-px bg-emas-400" />}
            </Link>

            <Link
              href="/subscription"
              className={`relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                aktif('/subscription') ? 'text-white' : 'text-tinta-300 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Langganan
              {aktif('/subscription') && <span className="absolute inset-x-3 -bottom-px h-px bg-emas-400" />}
            </Link>

            <Link
              href="/redaksi"
              className={`relative flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                aktif('/redaksi') ? 'text-white' : 'text-tinta-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Redaksi
              {aktif('/redaksi') && <span className="absolute inset-x-3 -bottom-px h-px bg-emas-400" />}
            </Link>

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
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors ${
                aktif('/') ? 'bg-white/10 text-white' : 'text-tinta-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Beranda
            </Link>

            {/* Rubrik accordion mobile */}
            <div>
              <button
                onClick={() => setRubrikMobileOpen(!rubrikMobileOpen)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 transition-colors ${
                  isRubrikAktif ? 'bg-white/10 text-white' : 'text-tinta-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Rubrik Sastra
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${rubrikMobileOpen ? 'rotate-180' : ''}`} />
              </button>

              {rubrikMobileOpen && (
                <div className="pl-6 pr-2 py-2 space-y-1 bg-white/[0.03] rounded-lg mt-1">
                  {rubrikList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-2 px-3 text-sm rounded-lg text-tinta-300 hover:text-white hover:bg-white/5"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-tinta-400">{cat.badge}</span>
                    </Link>
                  ))}
                  <Link
                    href="/categories"
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-3 text-xs text-emas-400 hover:underline"
                  >
                    Semua Kategori &rarr;
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/search"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors ${
                aktif('/search') ? 'bg-white/10 text-white' : 'text-tinta-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              Cari
            </Link>

            <Link
              href="/subscription"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors ${
                aktif('/subscription') ? 'bg-white/10 text-white' : 'text-tinta-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Langganan
            </Link>

            <Link
              href="/redaksi"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors ${
                aktif('/redaksi') ? 'bg-white/10 text-white' : 'text-tinta-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Redaksi
            </Link>

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
