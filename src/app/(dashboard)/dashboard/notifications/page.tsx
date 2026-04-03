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

function getNotifStyle(title: string, isRead: boolean) {
  if (title === 'Artikel Disetujui') return {
    icon: Check, bg: isRead ? 'bg-green-50' : 'bg-green-100', color: 'text-green-600',
    border: isRead ? 'border-gray-100' : 'border-green-200', gradient: isRead ? '' : 'from-green-50 to-emerald-50',
    actionText: 'Lihat karya →', actionColor: 'text-green-600',
  };
  if (title === 'Artikel Perlu Revisi') return {
    icon: AlertTriangle, bg: isRead ? 'bg-yellow-50' : 'bg-yellow-100', color: 'text-yellow-600',
    border: isRead ? 'border-gray-100' : 'border-yellow-200', gradient: isRead ? '' : 'from-yellow-50 to-amber-50',
    actionText: 'Edit artikel →', actionColor: 'text-yellow-600',
  };
  if (title === 'Artikel Ditolak') return {
    icon: XCircle, bg: isRead ? 'bg-red-50' : 'bg-red-100', color: 'text-red-600',
    border: isRead ? 'border-gray-100' : 'border-red-200', gradient: isRead ? '' : 'from-red-50 to-rose-50',
    actionText: 'Edit artikel →', actionColor: 'text-red-600',
  };
  return {
    icon: Bell, bg: isRead ? 'bg-gray-100' : 'bg-indigo-100', color: isRead ? 'text-gray-400' : 'text-indigo-600',
    border: isRead ? 'border-gray-100' : 'border-indigo-200', gradient: isRead ? '' : 'from-indigo-50 to-purple-50',
    actionText: '', actionColor: 'text-indigo-600',
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Notifikasi
            {unread > 0 && (
              <span className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-full animate-pulse">{unread}</span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{meta.total} notifikasi</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllAsRead} className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
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
                  className={`card-hover flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                    notif.is_read ? 'bg-white border-gray-100' : `bg-gradient-to-r ${style.gradient} ${style.border}`
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                    <Icon className={`w-5 h-5 ${style.color} ${!notif.is_read ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm ${notif.is_read ? 'text-gray-500' : 'text-gray-900'}`}>{notif.title}</p>
                      {!notif.is_read && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className={`text-sm mt-1 leading-relaxed ${notif.is_read ? 'text-gray-400' : 'text-gray-600'}`}>{notif.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
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
