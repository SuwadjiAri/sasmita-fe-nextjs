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
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="label-mikro">Statistik</p>
          <h1 className="mt-2 text-2xl font-semibold text-tinta-900">Performa Karya</h1>
          <p className="mt-1 text-sm text-tinta-500">Ringkasan capaian seluruh naskah Anda.</p>
        </div>
        <button onClick={handleExportPdf} className="btn-garis shrink-0">
          Unduh PDF
        </button>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 stagger-children md:grid-cols-5">
        {[
          { label: 'Total Karya', value: stats.total_articles },
          { label: 'Terbit', value: stats.published_articles },
          { label: 'Pembaca', value: stats.total_views },
          { label: 'Komentar', value: stats.total_comments },
          { label: 'Tersimpan', value: stats.total_bookmarks },
        ].map((card) => (
          <div key={card.label} className="kartu p-5">
            <p className="font-serif text-3xl font-semibold text-tinta-900">{card.value}</p>
            <p className="label-mikro mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-tinta-900">Lima Karya Terpopuler</h2>

      {stats.top_articles.length === 0 ? (
        <p className="text-tinta-500">Belum ada karya yang terbit.</p>
      ) : (
        <>
          <div className="kartu hidden overflow-hidden md:block">
            <table className="tabel">
              <thead>
                <tr>
                  <th className="w-12">#</th>
                  <th>Judul</th>
                  <th className="text-right">Pembaca</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_articles.map((a, i) => (
                  <tr key={a.id}>
                    <td className="text-tinta-500">{i + 1}</td>
                    <td className="font-medium text-tinta-900">{a.title}</td>
                    <td className="text-right text-tinta-500">{a.view_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {stats.top_articles.map((a, i) => (
              <div key={a.id} className="kartu flex items-center gap-3 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emas-50 font-serif text-xs font-semibold text-emas-700">
                  {i + 1}
                </span>
                <p className="line-clamp-1 min-w-0 flex-1 text-sm font-medium text-tinta-900">{a.title}</p>
                <span className="whitespace-nowrap text-sm text-tinta-500">{a.view_count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
