'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Users, Shield, Crown } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface User { id: number; name: string; email: string; isRedaksi: boolean; isAdmin: boolean; }

export default function AdminUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/admin/users').then((res) => setUsers(res.data.data || [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  const toggleRedaksi = async (userId: number, current: boolean) => {
    await api.put(`/admin/users/${userId}/role`, { is_redaksi: !current });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isRedaksi: !current } : u)));
    toast.show(current ? 'Hak redaksi dicabut' : 'Hak redaksi diberikan', 'success');
  };

  if (loading) return <LoadingSpinner message="Memuat pengguna..." />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} pengguna terdaftar</p>
      </div>

      <div className="space-y-3 stagger-children">
        {users.map((user) => (
          <div key={user.id} className="card-hover bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              user.isAdmin ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
              user.isRedaksi ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
              'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}>
              <span className="text-lg font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleRedaksi(user.id, user.isRedaksi)}
                className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  user.isRedaksi
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
    </div>
  );
}
