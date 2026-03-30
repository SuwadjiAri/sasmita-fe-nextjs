'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function PremiumGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setHasAccess(false);
      return;
    }

    api.get('/my/subscription')
      .then((res) => setHasAccess(res.data.data.has_active))
      .catch(() => setHasAccess(false));
  }, [user]);

  if (hasAccess === null) return <p className="text-gray-500">Memeriksa akses...</p>;

  if (!hasAccess) {
    return (
      <div className="relative">
        <div className="max-h-[300px] overflow-hidden">
          {children}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
        </div>
        <div className="text-center py-8 bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Artikel Premium</h3>
          <p className="text-gray-500 mb-4">Berlangganan untuk membaca artikel ini secara lengkap.</p>
          <Link
            href="/langganan"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            Berlangganan mulai Rp15.000/bulan
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
