'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Script from 'next/script';
import { useToast } from '@/components/ui/Toast';
import { Sparkles, Zap, Crown, Check, CheckCircle, Calendar, Clock, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useConfirm } from '@/components/ui/ConfirmModal';

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
  const confirmDialog = useConfirm();
  const [subscription, setSubscription] = useState<{ has_active: boolean; subscription: { status: string; expiredAt?: string } | null; history: { id: number; orderId: string; amount: number; status: string; snapToken?: string; paymentType?: string; createdAt?: string; startedAt?: string; expiredAt?: string }[] } | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    api.get('/my/subscription').then((res) => setSubscription(res.data.data)).catch(() => {});
    api.get('/subscription-plans').then((res) => setPlans(res.data.data || [])).catch(() => {});
  }, []);

  const handleSubscribe = (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    confirmDialog.show({
      title: 'Konfirmasi Langganan',
      message: `Anda akan berlangganan paket "${plan.name}" (${plan.durationDays} hari) seharga Rp${plan.price.toLocaleString('id-ID')}. Lanjutkan ke pembayaran?`,
      confirmLabel: 'Ya, Lanjutkan',
      type: 'info',
      onConfirm: async () => {
        setLoading(planId);
        try {
          const res = await api.post('/subscriptions', { plan_id: planId });
          const { snap_token } = res.data.data;
          if (window.snap) {
            window.snap.pay(snap_token, {
              onSuccess: () => { toast.show('Pembayaran berhasil!', 'success'); window.location.reload(); },
              onPending: () => { toast.show('Menunggu pembayaran. Cek riwayat di bawah.', 'info'); window.location.reload(); },
              onError: () => { toast.show('Pembayaran gagal', 'error'); },
              onClose: () => { toast.show('Pembayaran dibatalkan', 'info'); window.location.reload(); },
            });
          }
        } catch {
          toast.show('Gagal membuat transaksi', 'error');
        } finally {
          setLoading(null);
        }
      },
    });
  };

  return (
    <div>
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''} strategy="lazyOnload" />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Status Langganan</h1>

      {subscription === null ? (
        <LoadingSpinner message="Memuat langganan..." />
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
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">Belum Berlangganan</p>
                  <p className="text-white/70 text-sm">Pilih paket di bawah untuk akses semua artikel premium</p>
                </div>
              </div>
            </div>
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

      {/* Riwayat Transaksi */}
      {subscription && subscription.history && subscription.history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Transaksi</h2>
          <div className="space-y-3">
            {subscription.history.map((tx) => {
              const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
                pending: { label: 'Menunggu Pembayaran', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
                active: { label: 'Aktif', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
                expired: { label: 'Kadaluarsa', color: 'text-gray-600', bg: 'bg-gray-100', icon: AlertCircle },
                cancelled: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
                refunded: { label: 'Dikembalikan', color: 'text-blue-700', bg: 'bg-blue-100', icon: AlertCircle },
              };
              const st = statusConfig[tx.status] || statusConfig.pending;
              const StIcon = st.icon;

              const isPending = tx.status === 'pending' && tx.snapToken;

              const handleResume = () => {
                if (isPending && window.snap) {
                  window.snap.pay(tx.snapToken!, {
                    onSuccess: () => { toast.show('Pembayaran berhasil!', 'success'); window.location.reload(); },
                    onPending: () => { toast.show('Menunggu pembayaran...', 'info'); },
                    onError: () => { toast.show('Pembayaran gagal', 'error'); },
                    onClose: () => {},
                  });
                }
              };

              return (
                <div
                  key={tx.id}
                  onClick={isPending ? handleResume : undefined}
                  className={`bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 transition-all ${
                    isPending ? 'cursor-pointer hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-500/10' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${st.bg} flex items-center justify-center flex-shrink-0`}>
                    <StIcon className={`w-5 h-5 ${st.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">Rp{tx.amount.toLocaleString('id-ID')}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tx.orderId} · {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      {tx.paymentType && ` · ${tx.paymentType}`}
                    </p>
                  </div>
                  {isPending && (
                    <span className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-xl font-medium whitespace-nowrap">
                      Bayar Sekarang
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
