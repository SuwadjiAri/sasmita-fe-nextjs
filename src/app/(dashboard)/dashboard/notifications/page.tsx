'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Bell, CheckCheck, Clock, Check, AlertTriangle, XCircle } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';

interface Notification {
  id: number;
  title: string;
  message: string;
  reference_type?: string;
  reference_id?: number;
  is_read: boolean;
  created_at: string;
}

// Yang sudah dibaca berlatar putih, yang belum memakai warna status.
function getNotifStyle(title: string, isRead: boolean) {
  const netral = { latar: 'bg-white', garis: 'border-tinta-200/70' };

  if (title === 'Artikel Disetujui') return {
    icon: Check,
    bg: isRead ? 'bg-tinta-100' : 'bg-green-100',
    color: isRead ? 'text-tinta-400' : 'text-green-700',
    latar: isRead ? netral.latar : 'bg-green-50',
    garis: isRead ? netral.garis : 'border-green-200',
    actionText: 'Lihat karya', actionColor: 'text-green-800',
  };

  if (title === 'Artikel Perlu Revisi') return {
    icon: AlertTriangle,
    bg: isRead ? 'bg-tinta-100' : 'bg-emas-100',
    color: isRead ? 'text-tinta-400' : 'text-emas-700',
    latar: isRead ? netral.latar : 'bg-emas-50',
    garis: isRead ? netral.garis : 'border-emas-200',
    actionText: 'Sunting naskah', actionColor: 'text-emas-800',
  };

  if (title === 'Artikel Ditolak') return {
    icon: XCircle,
    bg: isRead ? 'bg-tinta-100' : 'bg-red-100',
    color: isRead ? 'text-tinta-400' : 'text-red-700',
    latar: isRead ? netral.latar : 'bg-red-50',
    garis: isRead ? netral.garis : 'border-red-200',
    actionText: 'Sunting naskah', actionColor: 'text-red-800',
  };

  return {
    icon: Bell,
    bg: isRead ? 'bg-tinta-100' : 'bg-tinta-900',
    color: isRead ? 'text-tinta-400' : 'text-emas-300',
    latar: isRead ? netral.latar : 'bg-tinta-50',
    garis: isRead ? netral.garis : 'border-tinta-300',
    actionText: '', actionColor: 'text-tinta-700',
  };
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 20, last_page: 1 });

  const loadNotifications = (p: number, pp: number = 20) => {
    setLoading(true);
    api.get(`/notifications?page=${p}&per_page=${pp}`).then((res) => {
      setNotifications(res.data.data.data || []);
      setUnread(res.data.data.unread_count || 0);
      setMeta({ total: res.data.data.total || 0, page: res.data.data.page || p, per_page: res.data.data.per_page || pp, last_page: res.data.data.last_page || 1 });
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadNotifications(1, perPage); }, []);

  const handlePageChange = (p: number) => { setPage(p); loadNotifications(p, perPage); };
  const handlePerPageChange = (pp: number) => { setPerPage(pp); setPage(1); loadNotifications(1, pp); };

  const markAsRead = async (id: number) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
  };

  const handleNotifClick = async (notif: Notification) => {
    if (!notif.is_read) await markAsRead(notif.id);
    if (notif.reference_type === 'article' && notif.reference_id) {
      if (notif.title === 'Artikel Disetujui') {
        router.push('/dashboard/articles');
      } else {
        router.push(`/dashboard/articles/${notif.reference_id}/edit`);
      }
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="label-mikro">Kabar</p>
          <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-semibold text-tinta-900">
            Notifikasi
            {unread > 0 && (
              <span className="rounded-full bg-red-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                {unread}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-tinta-500">{meta.total} notifikasi</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllAsRead} className="inline-flex items-center gap-1.5 text-sm text-emas-700 hover:text-emas-800 font-medium transition-colors">
            <CheckCheck className="w-4 h-4" />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat notifikasi..." />
      ) : notifications.length === 0 ? (
        <EmptyState icon="notification" title="Tidak ada notifikasi" description="Anda akan menerima notifikasi saat artikel anda direview." />
      ) : (
        <>
          <div className="space-y-3 stagger-children">
            {notifications.map((notif) => {
              const style = getNotifStyle(notif.title, notif.is_read);
              const Icon = style.icon;
              const hasLink = notif.reference_type && notif.reference_id;

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-5 transition-colors hover:border-tinta-300 ${style.latar} ${style.garis}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
                    <Icon className={`h-5 w-5 ${style.color}`} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${notif.is_read ? 'text-tinta-500' : 'text-tinta-900'}`}>
                        {notif.title}
                      </p>
                      {!notif.is_read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emas-600" />}
                    </div>

                    <p className={`mt-1 text-sm leading-relaxed ${notif.is_read ? 'text-tinta-400' : 'text-tinta-600'}`}>
                      {notif.message}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="flex items-center gap-1 text-xs text-tinta-400">
                        <Clock className="h-3 w-3" />
                        {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {hasLink && style.actionText && (
                        <span className={`text-xs font-medium ${style.actionColor}`}>{style.actionText}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination page={meta.page} lastPage={meta.last_page} total={meta.total} perPage={meta.per_page} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
        </>
      )}
    </div>
  );
}
