'use client';

import Link from 'next/link';
import { Lock, Eye, BookOpen } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export interface BookCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isPremium?: boolean;
  publishedAt?: string;
  viewCount?: number;
  categoryName?: string;
}

export default function BookCard({
  book,
  rank,
}: {
  book: BookCardProps;
  rank?: number;
}) {
  return (
    <Link
      href={`/articles/${book.slug}`}
      className="group flex flex-col rounded-2xl bg-white p-3.5 border border-tinta-200/70 hover:border-emas-400 hover:shadow-xl transition-all duration-300 relative"
    >
      {/* Ranking Badge if provided */}
      {typeof rank === 'number' && (
        <span className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-md ${
          rank === 1
            ? 'bg-emas-500 text-tinta-950 ring-2 ring-emas-300'
            : rank === 2
            ? 'bg-slate-300 text-slate-900 ring-2 ring-slate-200'
            : rank === 3
            ? 'bg-amber-700 text-white ring-2 ring-amber-500'
            : 'bg-tinta-900/80 text-white backdrop-blur'
        }`}>
          {rank}
        </span>
      )}

      {/* Book Cover Container with 2/3 ratio */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-tinta-100 shadow-inner group-hover:shadow-md transition-shadow">
        {book.coverImage ? (
          <img
            src={`${API}${book.coverImage}`}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-tinta-900 via-emas-950 to-tinta-950 flex flex-col items-center justify-center p-4 text-center">
            <span className="font-serif text-3xl font-bold text-emas-400 mb-2">
              {book.title.charAt(0)}
            </span>
            <span className="text-[10px] text-emas-300/80 uppercase tracking-widest font-mono">
              {book.categoryName || 'Novel'}
            </span>
          </div>
        )}

        {/* 3D Spine effect */}
        <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

        {/* Premium / Gratis pill */}
        <div className="absolute top-2 right-2">
          {book.isPremium ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emas-500 text-tinta-950 shadow">
              <Lock className="w-2.5 h-2.5" /> Premium
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-600 text-white shadow">
              Gratis
            </span>
          )}
        </div>
      </div>

      {/* Book Info */}
      <div className="mt-3.5 flex flex-col flex-1">
        {book.categoryName && (
          <span className="text-[11px] font-semibold text-emas-700 uppercase tracking-wider line-clamp-1">
            {book.categoryName}
          </span>
        )}

        <h3 className="mt-1 font-serif text-sm sm:text-base font-bold text-tinta-900 line-clamp-2 leading-snug group-hover:text-emas-700 transition-colors">
          {book.title}
        </h3>

        {book.excerpt && (
          <p className="mt-1.5 text-xs text-tinta-500 line-clamp-2 leading-relaxed flex-1">
            {book.excerpt}
          </p>
        )}

        <div className="mt-3 pt-2.5 border-t border-tinta-200/60 flex items-center justify-between text-[11px] text-tinta-400">
          <span className="inline-flex items-center gap-1 text-tinta-600 font-medium">
            <BookOpen className="w-3 h-3 text-emas-600" /> Baca
          </span>
          {typeof book.viewCount === 'number' && (
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" /> {book.viewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
