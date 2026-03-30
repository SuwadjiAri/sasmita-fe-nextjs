'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/notifications').then((res) => {
      setNotifications(res.data.data.data || []);
      setUnread(res.data.data.unread_count || 0);
    }).catch(() => {});
  }, []);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Notifikasi {unread > 0 && <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full ml-2">{unread}</span>}
        </h1>
        {unread > 0 && (<button onClick={markAllAsRead} className="text-sm text-indigo-600 hover:underline">Tandai semua dibaca</button>)}
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500">Tidak ada notifikasi.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-lg border cursor-pointer ${notif.is_read ? 'bg-white border-gray-200' : 'bg-indigo-50 border-indigo-200'}`} onClick={() => !notif.is_read && markAsRead(notif.id)}>
              <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
              <p className="text-gray-500 text-sm mt-1">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(notif.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
