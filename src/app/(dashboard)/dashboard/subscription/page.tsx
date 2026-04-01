'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Script from 'next/script';
import { useToast } from '@/components/ui/Toast';
import { Sparkles, Zap, Crown, Check, CheckCircle, Calendar } from 'lucide-react';

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

const planStyles = [
  { icon: Sparkles, gradient: 'from-blue-500 to-cyan-500', button: 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25', border: 'border-blue-200 hover:border-blue-400' },
  { icon: Zap, gradient: 'from-indigo-500 to-purple-600', button: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25', border: 'border-indigo-300 ring-2 ring-indigo-500/20' },
  { icon: Crown, gradient: 'from-amber-500 to-orange-500', button: 'bg-amber-600 hover:bg-amber-700 hover:shadow-amber-500/25', border: 'border-amber-200 hover:border-amber-400' },
];

const badges = [null, 'Paling Populer', 'Hemat'];

const benefits = [
  'Akses semua artikel premium',
  'Baca tanpa batas',
  'Dukung penulis SASMITA',
];

export default function SubscriptionDashboardPage() {
  const toast = useToast();
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
          onSuccess: () => { toast.show('Pembayaran berhasil!', 'success'); window.location.reload(); },
          onPending: () => { toast.show('Menunggu pembayaran...', 'info'); },
          onError: () => { toast.show('Pembayaran gagal', 'error'); },
          onClose: () => {},
        });
      }
    } catch {
      toast.show('Gagal membuat transaksi', 'error');
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
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-green-700 font-bold text-xl">Langganan Aktif</p>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Calendar className="w-4 h-4" />
            Berakhir: {subscription.subscription?.expiredAt
              ? new Date(subscription.subscription.expiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : '-'}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 font-semibold">Tidak ada langganan aktif</p>
            <p className="text-gray-500 text-sm mt-1">Pilih paket di bawah untuk berlangganan dan akses artikel premium.</p>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-5">Pilih Paket</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger-children">
            {plans.map((plan, index) => {
              const style = planStyles[index] || planStyles[0];
              const badge = badges[index];
              const Icon = style.icon;

              return (
                <div key={plan.id} className={`card-hover relative bg-white border-2 rounded-2xl p-5 text-center flex flex-col ${style.border}`}>
                  {badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={`bg-gradient-to-r ${style.gradient} text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-lg`}>
                        {badge}
                      </span>
                    </div>
                  )}

                  <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-4 mt-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">Rp{plan.price.toLocaleString('id-ID')}</span>
                    <span className="text-gray-400 text-sm ml-1">/ {plan.durationDays} hari</span>
                  </div>

                  <ul className="space-y-2 mb-6 text-left flex-1">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50 ${style.button}`}
                  >
                    {loading === plan.id ? 'Memproses...' : `Pilih ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
