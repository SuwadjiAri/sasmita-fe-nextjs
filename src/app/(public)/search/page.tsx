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
      {/* Hero search */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Cari Artikel</h1>
          <p className="text-indigo-100 mb-8">Temukan puisi, cerpen, esai, dan karya sastra lainnya</p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (!e.target.value.trim()) setSearched(false); }}
                placeholder="Ketik judul atau kata kunci..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-white/50 text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Mencari...' : 'Cari'}
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {!searched ? (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Artikel Terbaru</h2>
            {loadingLatest ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : latestArticles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada artikel yang dipublikasikan.</p>
            ) : (
              <div className="space-y-4 stagger-children">
                {latestArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="card-hover group flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5"
                  >
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{article.excerpt || 'Baca selengkapnya...'}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 mt-1 flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-1">Tidak ada hasil</p>
            <p className="text-gray-500">Tidak ditemukan artikel untuk &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              <span className="font-semibold text-gray-900">{results.length}</span> hasil untuk &ldquo;{query}&rdquo;
            </p>
            <div className="space-y-4 stagger-children">
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="card-hover group flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5"
                >
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{article.excerpt || 'Baca selengkapnya...'}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 mt-1 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
