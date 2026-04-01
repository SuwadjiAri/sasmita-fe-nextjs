'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Stats {
  total_articles: number;
  published_articles: number;
  total_views: number;
  total_comments: number;
  total_bookmarks: number;
  top_articles: { id: number; title: string; view_count: number }[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  const toast = useToast();

  useEffect(() => {
    api.get('/my/stats').then((res) => setStats(res.data.data)).catch(() => {});
  }, []);

  const handleExportPdf = async () => {
    try {
      const res = await api.get('/my/portfolio/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'portofolio.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.show('Gagal mengunduh portofolio', 'error');
    }
  };

  if (!stats) return <LoadingSpinner message="Memuat statistik..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistik</h1>
          <p className="text-gray-500 text-sm mt-1">Ringkasan performa karya anda</p>
        </div>
        <button onClick={handleExportPdf} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
          Export PDF
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 stagger-children">
        {[
          { label: 'Total Artikel', value: stats.total_articles, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Terbit', value: stats.published_articles, gradient: 'from-green-500 to-emerald-500' },
          { label: 'Pembaca', value: stats.total_views, gradient: 'from-purple-500 to-violet-500' },
          { label: 'Komentar', value: stats.total_comments, gradient: 'from-orange-500 to-amber-500' },
          { label: 'Bookmark', value: stats.total_bookmarks, gradient: 'from-pink-500 to-rose-500' },
        ].map((card) => (
          <div key={card.label} className="card-hover bg-white border border-gray-100 rounded-2xl p-5">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 opacity-80`}>
              <span className="text-xs font-bold text-white">{card.value}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Artikel</h2>
      {stats.top_articles.length === 0 ? (
        <p className="text-gray-500">Belum ada artikel terbit.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr><th className="text-left px-6 py-3">#</th><th className="text-left px-6 py-3">Judul</th><th className="text-right px-6 py-3">Pembaca</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.top_articles.map((a, i) => (
                  <tr key={a.id}><td className="px-6 py-3 text-sm text-gray-500">{i + 1}</td><td className="px-6 py-3 text-sm font-medium text-gray-900">{a.title}</td><td className="px-6 py-3 text-sm text-right text-gray-500">{a.view_count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {stats.top_articles.map((a, i) => (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <span className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm line-clamp-1">{a.title}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">{a.view_count} views</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
