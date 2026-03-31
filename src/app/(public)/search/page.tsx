'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cari Artikel</h1>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik judul atau kata kunci..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      {searched && (
        <div>
          <p className="text-gray-500 mb-4">
            {results.length} hasil untuk &ldquo;{query}&rdquo;
          </p>
          <div className="space-y-4">
            {results.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt || ''}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
