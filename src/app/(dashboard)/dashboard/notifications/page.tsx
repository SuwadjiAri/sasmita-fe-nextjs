'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Bell, CheckCheck, Clock, CheckCircle, ArrowRight } from 'lucide-react';
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
          <p className="text-gray-500 text-sm mt-1">{notifications.length} notifikasi</p>
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
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`card-hover flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                notif.is_read
                  ? 'bg-white border-gray-100'
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
              }`}
              onClick={async () => {
                if (!notif.is_read) await markAsRead(notif.id);
                if (notif.reference_type === 'article' && notif.reference_id) {
                  router.push(`/dashboard/articles/${notif.reference_id}/edit`);
                }
              }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notif.is_read ? 'bg-gray-100' : 'bg-indigo-100'
              }`}>
                {notif.is_read
                  ? <CheckCircle className="w-5 h-5 text-gray-400" />
                  : <Bell className="w-5 h-5 text-indigo-600 animate-pulse" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${notif.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</p>
                <p className={`text-sm mt-1 ${notif.is_read ? 'text-gray-400' : 'text-gray-600'}`}>{notif.message}</p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Clock className="w-3 h-3" />
                  {new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {notif.reference_type && notif.reference_id && (
                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
              )}
              {!notif.is_read && !notif.reference_type && (
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>

        <Pagination page={meta.page} lastPage={meta.last_page} total={meta.total} perPage={meta.per_page} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
        </>
      )}
    </div>
  );
}
