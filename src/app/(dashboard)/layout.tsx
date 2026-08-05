'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Bookmark, CreditCard, BarChart3,
  Bell, ClipboardCheck, Users, FolderOpen, Megaphone,
  LogOut, Menu, X, ChevronDown, Settings
} from 'lucide-react';
import api from '@/lib/api';

const memberMenus = [
  { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/dashboard/articles', label: 'Karya Saya', icon: FileText },
  { href: '/dashboard/bookmarks', label: 'Tersimpan', icon: Bookmark },
  { href: '/dashboard/subscription', label: 'Langganan', icon: CreditCard },
  { href: '/dashboard/statistics', label: 'Statistik', icon: BarChart3 },
  { href: '/dashboard/notifications', label: 'Notifikasi', icon: Bell },
];

const redaksiMenus = [
  { href: '/dashboard/reviews', label: 'Tinjau Naskah', icon: ClipboardCheck },
];

const adminMenus = [
  { href: '/dashboard/admin/users', label: 'Kelola Pengguna', icon: Users },
  { href: '/dashboard/admin/categories', label: 'Kelola Kategori', icon: FolderOpen },
  { href: '/dashboard/admin/plans', label: 'Kelola Paket', icon: CreditCard },
  { href: '/dashboard/admin/ads', label: 'Kelola Iklan', icon: Megaphone },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loadUser, logout: storeLogout } = useAuthStore();

  const handleLogout = () => {
    storeLogout();
    router.push('/login');
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  const fetchBadges = useCallback(() => {
    api.get('/notifications?page=1&per_page=1')
      .then((res) => setUnreadCount(res.data.data?.unread_count || 0))
      .catch(() => {});
  }, []);

  const fetchPendingReviews = useCallback(() => {
    api.get('/redaksi/reviews?page=1&per_page=1')
      .then((res) => setPendingReviews(res.data.meta?.total || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadUser().then(() => {
      const token = localStorage.getItem('token');
      if (!token) router.push('/login');
    });
    fetchBadges();
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, [loadUser, router, fetchBadges]);

  useEffect(() => {
    if (user?.is_redaksi) {
      fetchPendingReviews();
      const interval = setInterval(fetchPendingReviews, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchPendingReviews]);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-tinta-950">
        <img
          src="/logo-sasmita.png"
          alt="SASMITA.com"
          width={1048}
          height={225}
          className="mb-8 h-9 w-auto brightness-0 invert"
        />
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-emas-400" />
          <p className="text-sm text-tinta-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const allMenus = [
    { section: 'Menu', items: memberMenus },
    ...(user.is_redaksi ? [{ section: 'Redaksi', items: redaksiMenus }] : []),
    ...(user.is_admin ? [{ section: 'Admin', items: adminMenus }] : []),
  ];

  // Dipakai dua kali: latar gelap di layar lebar, putih di laci layar sempit.
  const sidebarContent = (mobile: boolean) => (
    <>
      <div className={`p-5 ${mobile ? 'border-b border-tinta-200/70' : 'border-b border-white/10'}`}>
        <Link href="/" className="inline-flex items-center">
          <img
            src="/logo-sasmita.png"
            alt="SASMITA.com"
            width={1048}
            height={225}
            className={`h-7 w-auto ${mobile ? '' : 'brightness-0 invert'}`}
          />
        </Link>
      </div>

      <div className={`relative px-3 py-3 ${mobile ? 'border-b border-tinta-200/70' : 'border-b border-white/10'}`}>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          aria-expanded={userMenuOpen}
          className={`flex w-full items-center gap-3 rounded-lg p-2.5 transition-colors ${
            mobile
              ? userMenuOpen ? 'bg-tinta-100' : 'hover:bg-tinta-50'
              : userMenuOpen ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-serif text-base font-semibold ${
              mobile ? 'bg-tinta-900 text-emas-300' : 'bg-white/10 text-emas-300'
            }`}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>

          <div className="min-w-0 flex-1 text-left">
            <p className={`truncate text-sm font-semibold ${mobile ? 'text-tinta-900' : 'text-white'}`}>
              {user.name}
            </p>
            <p className="truncate text-[11px] text-tinta-400">{user.email}</p>
          </div>

          <ChevronDown
            className={`h-4 w-4 text-tinta-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {userMenuOpen && (
          <div
            className={`mx-2 mt-2 animate-fade-in overflow-hidden rounded-lg border ${
              mobile ? 'border-tinta-200 bg-white' : 'border-white/10 bg-tinta-800'
            }`}
          >
            <div className="p-1.5">
              <Link
                href="/dashboard/profile"
                onClick={() => { setUserMenuOpen(false); if (mobile) setMobileOpen(false); }}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  mobile
                    ? 'text-tinta-700 hover:bg-tinta-50'
                    : 'text-tinta-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                Ubah Profil
              </Link>
              <button
                onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  mobile ? 'text-red-700 hover:bg-red-50' : 'text-red-300 hover:bg-red-500/10'
                }`}
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {allMenus.map((group) => (
          <div key={group.section}>
            <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest ${mobile ? 'text-tinta-400' : 'text-tinta-500'}`}>
              {group.section}
            </p>

            <div className="space-y-0.5">
              {group.items.map((menu) => {
                const isActive = pathname === menu.href;

                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={(e) => {
                      if (mobile) setMobileOpen(false);
                      if (isActive) {
                        e.preventDefault();
                        router.push(menu.href);
                        router.refresh();
                      }
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      mobile
                        ? isActive
                          ? 'bg-tinta-100 font-medium text-tinta-900'
                          : 'text-tinta-600 hover:bg-tinta-50 hover:text-tinta-900'
                        : isActive
                          ? 'bg-white/10 font-medium text-white'
                          : 'text-tinta-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <menu.icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? (mobile ? 'text-emas-700' : 'text-emas-400') : 'text-tinta-400'
                      }`}
                    />
                    <span className="flex-1">{menu.label}</span>

                    {menu.href === '/dashboard/notifications' && unreadCount > 0 && (
                      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}

                    {menu.href === '/dashboard/reviews' && pendingReviews > 0 && (
                      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emas-700 px-1 text-[10px] font-bold text-white">
                        {pendingReviews > 99 ? '99+' : pendingReviews}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-kertas">
      {/* Kepala layar sempit */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-tinta-200/70 bg-white px-4 md:hidden">
        <Link href="/" className="inline-flex items-center">
          <img src="/logo-sasmita.png" alt="SASMITA.com" width={1048} height={225} className="h-7 w-auto" />
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/notifications" className="relative rounded-lg p-2 hover:bg-tinta-100">
            <Bell className="h-5 w-5 text-tinta-600" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-700 px-0.5 text-[9px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            className="rounded-lg p-2 hover:bg-tinta-100"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Laci layar sempit */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-72 animate-slide-in-left flex-col bg-white md:hidden">
            {sidebarContent(true)}
          </aside>
        </>
      )}

      {/* Bilah samping layar lebar */}
      <aside className="hidden w-64 flex-col bg-tinta-950 md:flex">
        {sidebarContent(false)}
      </aside>

      <div className="min-w-0 flex-1 overflow-auto">
        <main className="animate-fade-in flex-1 p-6 pt-20 md:p-8">
          <div className="mb-4 -mt-2 hidden justify-end md:flex">
            <Link
              href="/dashboard/notifications"
              aria-label="Notifikasi"
              className="relative rounded-lg border border-tinta-200/70 bg-white p-2.5 transition-colors hover:border-tinta-300 hover:bg-tinta-50"
            >
              <Bell className="h-5 w-5 text-tinta-500" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-700 px-0.5 text-[9px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
