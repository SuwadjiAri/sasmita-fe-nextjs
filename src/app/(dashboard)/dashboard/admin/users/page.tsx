'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import { Shield, Crown, Search } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface User { id: number; name: string; email: string; isRedaksi: boolean; isAdmin: boolean; }

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 10, last_page: 1 });
  const [search, setSearch] = useState('');

  const loadUsers = useCallback((p: number, pp: number = 10) => {
    setLoading(true);
    api.get(`/admin/users?page=${p}&per_page=${pp}`)
      .then((res) => {
        setUsers(res.data.data || []);
        setMeta(res.data.meta || { total: 0, page: p, per_page: pp, last_page: 1 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadUsers(1, perPage); }, [loadUsers, perPage]);

  const handlePageChange = (p: number) => { setPage(p); loadUsers(p, perPage); };
  const handlePerPageChange = (pp: number) => { setPerPage(pp); setPage(1); loadUsers(1, pp); };

  const toggleRedaksi = async (userId: number, current: boolean) => {
    await api.put(`/admin/users/${userId}/role`, { is_redaksi: !current });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isRedaksi: !current } : u)));
    toast.show(current ? 'Hak redaksi dicabut' : 'Hak redaksi diberikan', 'success');
  };

  const filtered = search
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="label-mikro">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-tinta-900">Kelola Pengguna</h1>
          <p className="mt-1 text-sm text-tinta-500">{meta.total} pengguna terdaftar</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tinta-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email"
            aria-label="Cari pengguna"
            className="kolom-isian w-full pl-10 sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat pengguna..." />
      ) : (
        <>
          <div className="space-y-3 stagger-children">
            {filtered.map((user) => (
              <div key={user.id} className="kartu flex items-center gap-4 p-5">
                {/* Warna monogram menandai peran pengguna. */}
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-serif text-lg font-semibold ${
                    user.isAdmin
                      ? 'bg-emas-100 text-emas-800'
                      : user.isRedaksi
                        ? 'bg-tinta-900 text-emas-300'
                        : 'bg-tinta-100 text-tinta-700'
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-tinta-900">{user.name}</p>
                  <p className="mt-0.5 truncate text-xs text-tinta-400">{user.email}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleRedaksi(user.id, user.isRedaksi)}
                    aria-pressed={user.isRedaksi}
                    className={`lencana transition-colors ${
                      user.isRedaksi
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-tinta-100 text-tinta-600 hover:bg-tinta-200'
                    }`}
                  >
                    <Shield className="h-3 w-3" />
                    Redaksi
                  </button>

                  {user.isAdmin && (
                    <span className="lencana bg-emas-100 text-emas-800">
                      <Crown className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination page={meta.page} lastPage={meta.last_page} total={meta.total} perPage={meta.per_page} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
        </>
      )}
    </div>
  );
}
