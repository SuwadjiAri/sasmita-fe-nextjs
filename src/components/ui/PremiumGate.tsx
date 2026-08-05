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
      <div>
        {/* Selubung wajib transparan di atas, kalau pekat cuplikan ikut tertutup. */}
        <div className="relative max-h-[250px] overflow-hidden">
          {children}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(251,250,248,0) 0%, rgba(251,250,248,0.85) 65%, #fbfaf8 100%)',
            }}
          />
        </div>

        <div className="rounded-xl border border-emas-200 bg-emas-50 px-8 py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emas-700">
            <Crown className="h-7 w-7 text-white" />
          </span>
          <h3 className="mt-5 text-2xl font-semibold text-tinta-900">Karya Premium</h3>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-tinta-600">
            Berlangganan untuk membaca karya ini secara utuh, beserta seluruh
            karya premium lain di SASMITA.
          </p>
          <Link href="/subscription" className="btn-emas mt-7">
            <Lock className="h-4 w-4" />
            Lihat Paket Langganan
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
