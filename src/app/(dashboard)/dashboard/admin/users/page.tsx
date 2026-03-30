'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface User { id: number; name: string; email: string; isRedaksi: boolean; isAdmin: boolean; }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => { api.get('/admin/users').then((res) => setUsers(res.data.data || [])).catch(() => {}); }, []);

  const toggleRedaksi = async (userId: number, current: boolean) => {
    await api.put(`/admin/users/${userId}/role`, { is_redaksi: !current });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isRedaksi: !current } : u)));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Pengguna</h1>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr><th className="text-left px-6 py-3">Nama</th><th className="text-left px-6 py-3">Email</th><th className="text-center px-6 py-3">Redaksi</th><th className="text-center px-6 py-3">Admin</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-3 text-center">
                  <button onClick={() => toggleRedaksi(user.id, user.isRedaksi)} className={`text-xs px-3 py-1 rounded-full ${user.isRedaksi ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {user.isRedaksi ? 'Ya' : 'Tidak'}
                  </button>
                </td>
                <td className="px-6 py-3 text-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{user.isAdmin ? 'Ya' : 'Tidak'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
