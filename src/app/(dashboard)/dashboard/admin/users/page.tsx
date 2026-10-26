'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import {
  Shield, Crown, Search, UserCheck, UserX,
  Users, Feather, Lock, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface User {
  id: number;
  name: string;
  email: string;
  isRedaksi: boolean;
  isAdmin: boolean;
  isActive: boolean;
  createdAt?: string;
}

interface UserCounts {
  total: number;
  author: number;
  redaksi: number;
  admin: number;
  inactive: number;
}

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, last_page: 1 });
  const [roleFilter, setRoleFilter] = useState<'all' | 'author' | 'redaksi' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState<UserCounts>({
    total: 0,
    author: 0,
    redaksi: 0,
    admin: 0,
    inactive: 0,
  });
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadUsers = useCallback((p: number, pp: number, role: string, status: string, q: string) => {
    setLoading(true);
    const query = new URLSearchParams({
      page: p.toString(),
      per_page: pp.toString(),
      role: role !== 'all' ? role : '',
      status: status !== 'all' ? status : '',
      search: q,
    });

    api.get(`/admin/users?${query.toString()}`)
      .then((res) => {
        setUsers(res.data.data || []);
        setMeta(res.data.meta || { total: 0, page: p, per_page: pp, last_page: 1 });
        if (res.data.counts) {
          setCounts(res.data.counts);
        }
      })
      .catch(() => {
        toast.show('Gagal memuat data pengguna', 'error');
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    loadUsers(page, perPage, roleFilter, statusFilter, search);
  }, [loadUsers, page, perPage, roleFilter, statusFilter, search]);

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  const handlePerPageChange = (pp: number) => {
    setPerPage(pp);
    setPage(1);
  };

  const isMasterAdmin = (email: string) => {
    return email.toLowerCase() === 'newssasmita@gmail.com';
  };

  const toggleRedaksi = async (userId: number, current: boolean) => {
    setActionLoadingId(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { is_redaksi: !current });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isRedaksi: !current } : u)));
      toast.show(current ? 'Hak akses redaksi dicabut' : 'Hak akses redaksi berhasil diberikan', 'success');
      loadUsers(page, perPage, roleFilter, statusFilter, search);
    } catch {
      toast.show('Gagal memperbarui peran redaksi', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const toggleAdmin = async (userId: number, email: string, current: boolean) => {
    if (isMasterAdmin(email)) {
      toast.show('Akun newssasmita@gmail.com adalah administrator utama dan tidak dapat diubah.', 'info');
      return;
    }

    setActionLoadingId(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { is_admin: !current });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: !current } : u)));
      toast.show(current ? 'Hak administrator dicabut' : 'Hak administrator berhasil diberikan', 'success');
      loadUsers(page, perPage, roleFilter, statusFilter, search);
    } catch {
      toast.show('Gagal memperbarui hak administrator', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const toggleActiveStatus = async (userId: number, email: string, current: boolean) => {
    if (isMasterAdmin(email)) {
      toast.show('Akun newssasmita@gmail.com adalah administrator utama dan tidak dapat dinonaktifkan.', 'info');
      return;
    }

    setActionLoadingId(userId);
    try {
      await api.put(`/admin/users/${userId}/role`, { is_active: !current });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !current } : u)));
      toast.show(
        current ? 'Akun pengguna berhasil dinonaktifkan' : 'Akun pengguna berhasil diaktifkan kembali',
        current ? 'info' : 'success'
      );
      loadUsers(page, perPage, roleFilter, statusFilter, search);
    } catch {
      toast.show('Gagal mengubah status aktif akun', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="label-mikro">Admin Panel</p>
          <h1 className="mt-1 text-2xl font-serif font-bold text-tinta-900">Kelola Pengguna</h1>
          <p className="mt-1 text-sm text-tinta-500">
            Manajemen hierarki peran, filter kelompok akun, dan kendali status aktif pembaca & penulis.
          </p>
        </div>
      </div>

      {/* Kartu Ringkasan Metrik Pengguna */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kartu p-4 border border-tinta-100 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tinta-100 text-tinta-800">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-tinta-400 font-medium">Total Terdaftar</p>
            <p className="text-xl font-bold text-tinta-900">{counts.total}</p>
          </div>
        </div>

        <div className="kartu p-4 border border-tinta-100 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
            <Feather className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-tinta-400 font-medium">Penulis / Pembaca</p>
            <p className="text-xl font-bold text-blue-900">{counts.author}</p>
          </div>
        </div>

        <div className="kartu p-4 border border-tinta-100 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-tinta-400 font-medium">Dewan Redaksi</p>
            <p className="text-xl font-bold text-green-900">{counts.redaksi}</p>
          </div>
        </div>

        <div className="kartu p-4 border border-tinta-100 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emas-100 text-emas-800">
            <Crown className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-tinta-400 font-medium">Administrator</p>
            <p className="text-xl font-bold text-emas-900">{counts.admin}</p>
          </div>
        </div>
      </div>

      {/* Bilah Filter dan Pencarian */}
      <div className="kartu p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tab Filter Kelompok Peran */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-latar rounded-xl border border-tinta-100">
            <button
              onClick={() => { setRoleFilter('all'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === 'all'
                  ? 'bg-white shadow-xs text-tinta-900 font-semibold'
                  : 'text-tinta-500 hover:text-tinta-900'
              }`}
            >
              Semua ({counts.total})
            </button>
            <button
              onClick={() => { setRoleFilter('author'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === 'author'
                  ? 'bg-blue-600 shadow-xs text-white font-semibold'
                  : 'text-tinta-500 hover:text-tinta-900'
              }`}
            >
              Penulis & Pembaca ({counts.author})
            </button>
            <button
              onClick={() => { setRoleFilter('redaksi'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === 'redaksi'
                  ? 'bg-green-700 shadow-xs text-white font-semibold'
                  : 'text-tinta-500 hover:text-tinta-900'
              }`}
            >
              Dewan Redaksi ({counts.redaksi})
            </button>
            <button
              onClick={() => { setRoleFilter('admin'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === 'admin'
                  ? 'bg-emas-700 shadow-xs text-white font-semibold'
                  : 'text-tinta-500 hover:text-tinta-900'
              }`}
            >
              Administrator ({counts.admin})
            </button>
          </div>

          {/* Filter Status & Input Pencarian */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
                setPage(1);
              }}
              aria-label="Filter status akun"
              className="kolom-isian text-xs py-2 px-3 sm:w-40"
            >
              <option value="all">Semua Status</option>
              <option value="active">Akun Aktif</option>
              <option value="inactive">Akun Nonaktif</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tinta-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama atau email..."
                aria-label="Cari nama atau email"
                className="kolom-isian w-full pl-9 pr-3 py-2 text-xs sm:w-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Daftar Pengguna */}
      {loading ? (
        <LoadingSpinner message="Memuat daftar pengguna..." />
      ) : users.length === 0 ? (
        <div className="kartu p-12 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-tinta-300 mb-3" />
          <p className="font-semibold text-tinta-700">Tidak ada pengguna ditemukan</p>
          <p className="text-xs text-tinta-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter peran akun.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 stagger-children">
            {users.map((user) => {
              const master = isMasterAdmin(user.email);
              const isLoading = actionLoadingId === user.id;

              return (
                <div
                  key={user.id}
                  className={`kartu flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 transition-all ${
                    !user.isActive ? 'bg-red-50/40 border-red-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Monogram Inisial */}
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-serif text-lg font-bold shadow-xs ${
                        master
                          ? 'bg-gradient-to-br from-amber-400 to-emas-700 text-white'
                          : user.isAdmin
                            ? 'bg-emas-100 text-emas-800'
                            : user.isRedaksi
                              ? 'bg-tinta-900 text-emas-300'
                              : 'bg-tinta-100 text-tinta-700'
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-tinta-900 leading-tight">{user.name}</p>
                        
                        {/* Status Aktif / Nonaktif */}
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Dinonaktifkan
                          </span>
                        )}

                        {master && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Lock className="h-2.5 w-2.5" />
                            Admin Utama (Terproteksi)
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 truncate text-xs text-tinta-400">{user.email}</p>

                      {/* Badge Peran Pengguna */}
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        {user.isAdmin && (
                          <span className="lencana bg-emas-100 text-emas-800 text-[10px]">
                            <Crown className="h-3 w-3" />
                            Admin
                          </span>
                        )}
                        {user.isRedaksi && (
                          <span className="lencana bg-green-100 text-green-800 text-[10px]">
                            <Shield className="h-3 w-3" />
                            Redaksi
                          </span>
                        )}
                        {!user.isAdmin && !user.isRedaksi && (
                          <span className="lencana bg-tinta-100 text-tinta-600 text-[10px]">
                            <Feather className="h-3 w-3" />
                            Penulis / Pembaca
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi Kendali Peran & Status */}
                  <div className="flex shrink-0 items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    {/* Toggle Redaksi */}
                    <button
                      onClick={() => toggleRedaksi(user.id, user.isRedaksi)}
                      disabled={isLoading}
                      aria-label={user.isRedaksi ? 'Cabut hak redaksi' : 'Berikan hak redaksi'}
                      className={`lencana transition-colors cursor-pointer text-xs ${
                        user.isRedaksi
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-tinta-100 text-tinta-600 hover:bg-tinta-200'
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {user.isRedaksi ? 'Redaksi (Aktif)' : '+ Redaksi'}
                    </button>

                    {/* Toggle Admin */}
                    {master ? (
                      <span
                        title="Akun newssasmita@gmail.com adalah administrator utama dan tidak dapat dicabut hak adminnya"
                        className="lencana bg-amber-50 text-amber-800 border border-amber-200 cursor-not-allowed text-xs opacity-90"
                      >
                        <Crown className="h-3 w-3 text-amber-600" />
                        Admin Utama
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleAdmin(user.id, user.email, user.isAdmin)}
                        disabled={isLoading}
                        aria-label={user.isAdmin ? 'Cabut hak admin' : 'Jadikan admin'}
                        className={`lencana transition-colors cursor-pointer text-xs ${
                          user.isAdmin
                            ? 'bg-emas-100 text-emas-800 hover:bg-emas-200'
                            : 'bg-tinta-100 text-tinta-600 hover:bg-tinta-200'
                        }`}
                      >
                        <Crown className="h-3 w-3" />
                        {user.isAdmin ? 'Admin (Aktif)' : '+ Admin'}
                      </button>
                    )}

                    {/* Toggle Status Aktif / Nonaktif Akun */}
                    {master ? (
                      <span
                        title="Akun administrator utama tidak dapat dinonaktifkan"
                        className="lencana bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-not-allowed text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Permanen Aktif
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleActiveStatus(user.id, user.email, user.isActive)}
                        disabled={isLoading}
                        aria-label={user.isActive ? 'Nonaktifkan akun' : 'Aktifkan akun'}
                        className={`lencana transition-colors cursor-pointer text-xs ${
                          user.isActive
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="h-3 w-3" />
                            Nonaktifkan
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3" />
                            Aktifkan Akun
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            page={meta.page}
            lastPage={meta.last_page}
            total={meta.total}
            perPage={meta.per_page}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}
    </div>
  );
}
