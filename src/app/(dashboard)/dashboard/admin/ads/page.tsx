'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { Megaphone, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';

interface AdPlacement { id: number; name: string; slotId?: string; position: string; isActive: boolean; }

const positionLabel: Record<string, string> = {
  header: 'Header',
  sidebar: 'Sidebar',
  in_article: 'Dalam Artikel',
  footer: 'Footer',
};

export default function AdminAdsPage() {
  const toast = useToast();
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAds(); }, []);

  const loadAds = () => { api.get('/admin/ads').then((res) => setAds(res.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };

  const toggleActive = async (id: number, current: boolean) => {
    await api.put(`/admin/ads/${id}`, { is_active: !current });
    loadAds();
    toast.show(current ? 'Slot iklan dinonaktifkan' : 'Slot iklan diaktifkan', 'success');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Slot Iklan</h1>
        <p className="text-gray-500 text-sm mt-1">{ads.length} slot iklan</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat iklan..." />
      ) : ads.length === 0 ? (
        <EmptyState icon="article" title="Belum ada slot iklan" description="Tambahkan slot iklan untuk monetisasi platform." />
      ) : (
        <div className="space-y-3 stagger-children">
          {ads.map((ad) => (
            <div key={ad.id} className="card-hover bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                ad.isActive ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Megaphone className={`w-5 h-5 ${ad.isActive ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{ad.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {positionLabel[ad.position] || ad.position}
                  {ad.slotId && <span>· {ad.slotId}</span>}
                </p>
              </div>
              <button
                onClick={() => toggleActive(ad.id, ad.isActive)}
                className={`inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-medium transition-all ${
                  ad.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {ad.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {ad.isActive ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
