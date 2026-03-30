'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Script from 'next/script';

interface Plan {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description?: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess: () => void;
        onPending: () => void;
        onError: () => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function SubscriptionDashboardPage() {
  const [subscription, setSubscription] = useState<{ has_active: boolean; subscription: { status: string; expiredAt?: string } | null } | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    api.get('/my/subscription').then((res) => setSubscription(res.data.data)).catch(() => {});
    api.get('/subscription-plans').then((res) => setPlans(res.data.data || [])).catch(() => {});
  }, []);

  const handleSubscribe = async (planId: number) => {
    setLoading(planId);
    try {
      const res = await api.post('/subscriptions', { plan_id: planId });
      const { snap_token } = res.data.data;
      if (window.snap) {
        window.snap.pay(snap_token, {
          onSuccess: () => { alert('Pembayaran berhasil!'); window.location.reload(); },
          onPending: () => { alert('Menunggu pembayaran...'); },
          onError: () => { alert('Pembayaran gagal'); },
          onClose: () => {},
        });
      }
    } catch {
      alert('Gagal membuat transaksi');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''} strategy="lazyOnload" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Status Langganan</h1>
      {subscription === null ? (
        <p className="text-gray-500">Memuat...</p>
      ) : subscription.has_active ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <p className="text-green-700 font-semibold text-lg">Langganan Aktif</p>
          <p className="text-green-600 text-sm mt-2">
            Berakhir: {subscription.subscription?.expiredAt ? new Date(subscription.subscription.expiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 font-semibold">Tidak ada langganan aktif</p>
            <p className="text-gray-500 text-sm mt-2">Pilih paket di bawah untuk berlangganan.</p>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Paket</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-1">Rp{plan.price.toLocaleString('id-ID')}</p>
                <p className="text-gray-500 text-sm mb-4">{plan.durationDays} hari</p>
                <button onClick={() => handleSubscribe(plan.id)} disabled={loading === plan.id} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
                  {loading === plan.id ? 'Memproses...' : 'Pilih'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
