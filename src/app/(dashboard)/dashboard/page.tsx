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
        { label: 'Total Karya', value: stats.total_articles, icon: FileText },
        { label: 'Terbit', value: stats.published_articles, icon: CheckCircle },
        { label: 'Pembaca', value: stats.total_views, icon: Eye },
        { label: 'Komentar', value: stats.total_comments, icon: MessageCircle },
        { label: 'Tersimpan', value: stats.total_bookmarks, icon: Bookmark },
      ]
    : [];

  return (
    <div className="animate-fade-in-up">
      <header className="mb-8">
        <p className="label-mikro">Ringkasan</p>
        <h1 className="mt-2 text-2xl font-semibold text-tinta-900">
          Selamat datang, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-tinta-500">Berikut ringkasan aktivitas Anda di SASMITA.</p>
      </header>

      {stats ? (
        <div className="mb-10 grid grid-cols-2 gap-4 stagger-children md:grid-cols-5">
          {statCards.map((card) => (
            <div key={card.label} className="kartu p-5">
              <card.icon className="h-5 w-5 text-tinta-400" />
              <p className="mt-4 font-serif text-3xl font-semibold text-tinta-900">{card.value}</p>
              <p className="label-mikro mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="kartu animate-pulse p-5">
              <div className="h-5 w-5 rounded bg-tinta-200" />
              <div className="mt-4 h-8 w-12 rounded bg-tinta-200" />
              <div className="mt-2 h-3 w-20 rounded bg-tinta-100" />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/articles/create"
          className="group flex items-center gap-4 rounded-xl bg-tinta-900 p-6 text-white transition-colors hover:bg-tinta-800"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <PenLine className="h-6 w-6 text-emas-300" />
          </span>
          <div className="flex-1">
            <p className="text-lg font-semibold">Tulis Karya Baru</p>
            <p className="text-sm text-tinta-300">Mulai menyusun naskah Anda</p>
          </div>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link href="/dashboard/articles" className="kartu-tautan group flex items-center gap-4 p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emas-50">
            <FileText className="h-6 w-6 text-emas-700" />
          </span>
          <div className="flex-1">
            <p className="text-lg font-semibold text-tinta-900">Kelola Karya</p>
            <p className="text-sm text-tinta-500">Lihat, sunting, dan kirim naskah</p>
          </div>
          <ArrowRight className="h-5 w-5 text-tinta-400 transition-all group-hover:translate-x-1 group-hover:text-emas-700" />
        </Link>
      </div>
    </div>
  );
}
