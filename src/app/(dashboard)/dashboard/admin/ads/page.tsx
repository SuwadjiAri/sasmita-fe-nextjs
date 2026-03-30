'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface AdPlacement { id: number; name: string; slotId?: string; position: string; isActive: boolean; }

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdPlacement[]>([]);

  useEffect(() => { loadAds(); }, []);

  const loadAds = () => { api.get('/admin/ads').then((res) => setAds(res.data.data || [])).catch(() => {}); };

  const toggleActive = async (id: number, current: boolean) => {
    await api.put(`/admin/ads/${id}`, { is_active: !current });
    loadAds();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Slot Iklan</h1>
      {ads.length === 0 ? (<p className="text-gray-500">Belum ada slot iklan.</p>) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr><th className="text-left px-6 py-3">Nama</th><th className="text-left px-6 py-3">Posisi</th><th className="text-left px-6 py-3">Slot ID</th><th className="text-center px-6 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{ad.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{ad.position}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{ad.slotId || '-'}</td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => toggleActive(ad.id, ad.isActive)} className={`text-xs px-3 py-1 rounded-full ${ad.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {ad.isActive ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
