'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Lock, Crown } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

  if (hasAccess === null) return <LoadingSpinner message="Memeriksa akses..." />;

  if (!hasAccess) {
    return (
      <div className="relative">
        <div className="max-h-[250px] overflow-hidden">
          {children}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/90 to-white" />
        </div>
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-2xl" />
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Artikel Premium</h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto">Berlangganan untuk membaca artikel ini secara lengkap dan akses semua konten premium.</p>
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 hover:shadow-xl hover:shadow-white/20 transition-all"
            >
              <Lock className="w-4 h-4" />
              Berlangganan mulai Rp15.000/bulan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
