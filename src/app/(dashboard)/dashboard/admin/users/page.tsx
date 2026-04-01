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
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1">{meta.total} pengguna terdaftar</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat pengguna..." />
      ) : (
        <>
          <div className="space-y-3 stagger-children">
            {filtered.map((user) => (
              <div key={user.id} className="card-hover bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  user.isAdmin ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                  user.isRedaksi ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                  'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  <span className="text-lg font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleRedaksi(user.id, user.isRedaksi)}
                    className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                      user.isRedaksi ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    Redaksi
                  </button>
                  {user.isAdmin && (
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium bg-purple-100 text-purple-700">
                      <Crown className="w-3 h-3" />
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
