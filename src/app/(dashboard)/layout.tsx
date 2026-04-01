'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Bookmark, CreditCard, BarChart3,
  Bell, UserCircle, ClipboardCheck, Users, FolderOpen, Megaphone,
  LogOut, PenLine, ChevronRight, Menu, X, ChevronDown, Settings
} from 'lucide-react';

const memberMenus = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/articles', label: 'Karya Saya', icon: FileText },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/statistics', label: 'Statistics', icon: BarChart3 },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
];

const redaksiMenus = [
  { href: '/dashboard/reviews', label: 'Review Artikel', icon: ClipboardCheck },
];

const adminMenus = [
  { href: '/dashboard/admin/users', label: 'Kelola Pengguna', icon: Users },
  { href: '/dashboard/admin/categories', label: 'Kelola Kategori', icon: FolderOpen },
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

  useEffect(() => {
    loadUser().then(() => {
      const token = localStorage.getItem('token');
      if (!token) router.push('/login');
    });
  }, [loadUser, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">SASMITA</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const allMenus = [
    { section: 'Menu', items: memberMenus },
    ...(user.is_redaksi ? [{ section: 'Redaksi', items: redaksiMenus }] : []),
    ...(user.is_admin ? [{ section: 'Admin', items: adminMenus }] : []),
  ];

  const sidebarContent = (mobile: boolean) => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <PenLine className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">SASMITA</span>
        </Link>
      </div>

      {/* User info - clickable dropdown */}
      <div className="px-3 py-3 border-b border-gray-100 relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all ${
            userMenuOpen
              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <span className="text-base font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {userMenuOpen && (
          <div className="mx-2 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden animate-fade-in">
            <div className="p-1.5">
              <Link
                href="/dashboard/profile"
                onClick={() => { setUserMenuOpen(false); if (mobile) setMobileOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
              >
                <Settings className="w-4 h-4" />
                Edit Profil
              </Link>
              <button
                onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {allMenus.map((group) => (
          <div key={group.section}>
            <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{group.section}</p>
            <div className="space-y-0.5">
              {group.items.map((menu) => {
                const isActive = pathname === menu.href;
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={() => mobile && setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <menu.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="flex-1">{menu.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 text-indigo-400" />}
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <PenLine className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">SASMITA</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col animate-slide-in-left">
            {sidebarContent(true)}
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
        {sidebarContent(false)}
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 pt-20 md:pt-8 md:p-8 overflow-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
}
