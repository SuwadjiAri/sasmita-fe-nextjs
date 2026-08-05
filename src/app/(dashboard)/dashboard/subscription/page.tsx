'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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

const benefits = [
  'Akses seluruh karya premium',
  'Membaca tanpa batas',
  'Mendukung penulis SASMITA',
];

export default function SubscriptionDashboardPage() {
  const toast = useToast();
  const confirmDialog = useConfirm();
  const searchParams = useSearchParams();
  const autoTriggered = useRef(false);
  const [subscription, setSubscription] = useState<{ has_active: boolean; subscription: { status: string; expiredAt?: string } | null; history: { id: number; orderId: string; amount: number; status: string; snapToken?: string; paymentType?: string; createdAt?: string; startedAt?: string; expiredAt?: string }[] } | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [plansLoaded, setPlansLoaded] = useState(false);

  useEffect(() => {
    api.get('/my/subscription').then((res) => setSubscription(res.data.data)).catch(() => {});
    api.get('/subscription-plans').then((res) => { setPlans(res.data.data || []); setPlansLoaded(true); }).catch(() => {});
  }, []);

  // Auto-trigger subscribe from public page ?plan=ID
  useEffect(() => {
    const planId = searchParams.get('plan');
    if (planId && plansLoaded && plans.length > 0 && !autoTriggered.current && subscription && !subscription.has_active) {
      autoTriggered.current = true;
      const id = parseInt(planId);
      if (plans.find(p => p.id === id)) {
        setTimeout(() => handleSubscribe(id), 500);
      }
    }
  }, [searchParams, plansLoaded, plans, subscription]);

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

      <header className="mb-6">
        <p className="label-mikro">Langganan</p>
        <h1 className="mt-2 text-2xl font-semibold text-tinta-900">Status Langganan</h1>
      </header>

      {subscription === null ? (
        <LoadingSpinner message="Memuat langganan..." />
      ) : subscription.has_active ? (
        <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-700" />
            <p className="text-xl font-semibold text-green-900">Langganan Aktif</p>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-green-800">
            <Calendar className="h-4 w-4" />
            Berakhir {subscription.subscription?.expiredAt
              ? new Date(subscription.subscription.expiredAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
              : '-'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 flex items-start gap-4 rounded-xl bg-tinta-900 p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <CreditCard className="h-6 w-6 text-emas-300" />
            </span>
            <div>
              <p className="text-xl font-semibold text-white">Belum Berlangganan</p>
              <p className="mt-1 text-sm text-tinta-300">
                Pilih paket di bawah untuk membuka seluruh karya premium.
              </p>
            </div>
          </div>

          <h2 className="mb-5 text-lg font-semibold text-tinta-900">Pilih Paket</h2>
          <div className="grid grid-cols-1 gap-4 stagger-children lg:grid-cols-3">
            {plans.map((plan, index) => {
              // Paket di tengah ditandai sebagai pilihan yang disarankan.
              const disorot = plans.length % 2 === 1 && index === Math.floor(plans.length / 2);

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-xl border bg-white p-6 ${
                    disorot ? 'border-emas-300 ring-1 ring-emas-300' : 'border-tinta-200/70'
                  }`}
                >
                  {disorot && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emas-700 px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                      Paling Populer
                    </span>
                  )}

                  <h3 className="label-mikro">{plan.name}</h3>

                  <p className="mt-3 font-serif text-3xl font-semibold text-tinta-900">
                    Rp{plan.price.toLocaleString('id-ID')}
                  </p>
                  <p className="mt-1 text-sm text-tinta-500">untuk {plan.durationDays} hari</p>

                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-tinta-200/70 pt-5">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-tinta-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emas-700" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className={`mt-6 w-full ${disorot ? 'btn-emas' : 'btn-utama'}`}
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
          <h2 className="mb-4 text-lg font-semibold text-tinta-900">Riwayat Transaksi</h2>
          <div className="space-y-3">
            {subscription.history.map((tx) => {
              const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
                pending: { label: 'Menunggu Pembayaran', color: 'text-emas-800', bg: 'bg-emas-100', icon: Clock },
                active: { label: 'Aktif', color: 'text-green-800', bg: 'bg-green-100', icon: CheckCircle },
                expired: { label: 'Kedaluwarsa', color: 'text-tinta-600', bg: 'bg-tinta-100', icon: AlertCircle },
                cancelled: { label: 'Dibatalkan', color: 'text-red-800', bg: 'bg-red-100', icon: XCircle },
                refunded: { label: 'Dikembalikan', color: 'text-tinta-700', bg: 'bg-tinta-100', icon: AlertCircle },
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
                  className={`kartu flex items-center gap-4 p-5 transition-colors ${
                    isPending ? 'cursor-pointer hover:border-emas-300' : ''
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${st.bg}`}>
                    <StIcon className={`h-5 w-5 ${st.color}`} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-tinta-900">Rp{tx.amount.toLocaleString('id-ID')}</p>
                      <span className={`lencana ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-tinta-400">
                      {tx.orderId} / {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      {tx.paymentType && ` / ${tx.paymentType}`}
                    </p>
                  </div>

                  {isPending && (
                    <span className="btn-emas btn-kecil whitespace-nowrap">
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
