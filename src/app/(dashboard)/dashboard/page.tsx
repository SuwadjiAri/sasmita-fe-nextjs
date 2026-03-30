'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { FileText, Eye, MessageCircle, Bookmark, CheckCircle, PenLine, ArrowRight } from 'lucide-react';

interface Stats {
  total_articles: number;
  published_articles: number;
  total_views: number;
  total_comments: number;
  total_bookmarks: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get('/my/stats').then((res) => setStats(res.data.data)).catch(() => {});
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Artikel', value: stats.total_articles, icon: FileText, color: 'from-blue-500 to-blue-600' },
        { label: 'Terbit', value: stats.published_articles, icon: CheckCircle, color: 'from-green-500 to-green-600' },
        { label: 'Total Pembaca', value: stats.total_views, icon: Eye, color: 'from-purple-500 to-purple-600' },
        { label: 'Komentar', value: stats.total_comments, icon: MessageCircle, color: 'from-orange-500 to-orange-600' },
        { label: 'Bookmark', value: stats.total_bookmarks, icon: Bookmark, color: 'from-pink-500 to-pink-600' },
      ]
    : [];

  return (
    <div className="animate-fade-in-up">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat datang, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 mt-1">Berikut ringkasan aktivitas anda di SASMITA</p>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 stagger-children">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-200 mb-3" />
              <div className="h-7 w-12 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/articles/create"
          className="group flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl hover:shadow-xl hover:shadow-indigo-500/20 transition-all"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <PenLine className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">Tulis Artikel Baru</p>
            <p className="text-indigo-200 text-sm">Mulai menulis karya sastra anda</p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/articles"
          className="group flex items-center gap-4 bg-white border border-gray-100 p-6 rounded-2xl card-hover"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg text-gray-900">Kelola Karya</p>
            <p className="text-gray-500 text-sm">Lihat dan edit artikel anda</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
        </Link>
      </div>
    </div>
  );
}
