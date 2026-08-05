'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Search, BookOpen, ArrowRight } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
}

function tanggal(nilai?: string) {
  if (!nilai) return '';
  return new Date(nilai).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Bentuk daftar, bukan kartu, karena halaman ini dipakai memindai banyak judul.
function BarisKarya({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex items-start gap-5 border-b border-tinta-200/70 py-6 last:border-0"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-tinta-900 font-serif text-lg text-emas-300/70">
        {article.title.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-snug text-tinta-900 transition-colors group-hover:text-emas-700">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-tinta-500">
          {article.excerpt || 'Baca selengkapnya.'}
        </p>
        {article.publishedAt && (
          <p className="mt-2 text-xs text-tinta-400">{tanggal(article.publishedAt)}</p>
        )}
      </div>

      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-tinta-300 transition-all group-hover:translate-x-0.5 group-hover:text-emas-700" />
    </Link>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    api.get('/articles?per_page=6')
      .then((res) => setLatestArticles(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingLatest(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/articles?search=${encodeURIComponent(query)}`);
      setResults(res.data.data || []);
    } catch {
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-tinta-950 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <p className="label-mikro text-emas-300">Pencarian</p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Cari Karya</h1>
          <p className="mt-3 text-tinta-300">
            Telusuri puisi, cerpen, esai, novel, resensi, dan artikel akademik.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tinta-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!e.target.value.trim()) setSearched(false);
                }}
                placeholder="Ketik judul atau kata kunci"
                aria-label="Kata kunci pencarian"
                className="w-full rounded-lg border border-white/15 bg-white/[0.06] py-3.5 pl-12 pr-4 text-white placeholder:text-tinta-400 focus:border-emas-400 focus:outline-none focus:ring-1 focus:ring-emas-400"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-emas px-8 py-3.5">
              {loading ? 'Mencari...' : 'Cari'}
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12">
        {!searched ? (
          <div>
            <h2 className="label-mikro">Karya Terbaru</h2>

            {loadingLatest ? (
              <div className="flex justify-center py-16">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-tinta-300 border-t-tinta-900" />
              </div>
            ) : latestArticles.length === 0 ? (
              <p className="py-12 text-center text-tinta-500">Belum ada karya yang diterbitkan.</p>
            ) : (
              <div className="mt-4">
                {latestArticles.map((article) => (
                  <BarisKarya key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-tinta-300 px-6 py-20 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-tinta-300" />
            <p className="mt-4 text-lg font-semibold text-tinta-900">Tidak ada hasil</p>
            <p className="mt-1 text-tinta-500">
              Tidak ditemukan karya untuk &ldquo;{query}&rdquo;.
            </p>
          </div>
        ) : (
          <>
            <p className="label-mikro">
              {results.length} hasil untuk &ldquo;{query}&rdquo;
            </p>
            <div className="mt-4">
              {results.map((article) => (
                <BarisKarya key={article.id} article={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
