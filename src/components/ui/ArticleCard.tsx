import Link from 'next/link';
import { Lock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || '';

export type ArtikelKartu = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isPremium?: boolean;
  publishedAt?: string;
};

function tanggal(nilai?: string) {
  if (!nilai) return '';
  return new Date(nilai).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Kartu ringkas satu karya. `label` dikosongkan bila kategorinya sudah jelas.
export default function ArticleCard({
  article,
  label,
}: {
  article: ArtikelKartu;
  label?: string;
}) {
  return (
    <Link href={`/articles/${article.slug}`} className="kartu-tautan group flex flex-col overflow-hidden">
      {article.coverImage ? (
        <div className="h-44 overflow-hidden bg-tinta-100">
          <img
            src={`${API}${article.coverImage}`}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center bg-tinta-900">
          <span className="font-serif text-4xl text-emas-300/40">
            {article.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {(label || article.isPremium) && (
          <div className="flex flex-wrap items-center gap-2">
            {label && <span className="lencana bg-tinta-100 text-tinta-600">{label}</span>}
            {article.isPremium && (
              <span className="lencana bg-emas-100 text-emas-800">
                <Lock className="h-3 w-3" />
                Premium
              </span>
            )}
          </div>
        )}

        <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-tinta-900 transition-colors group-hover:text-emas-700">
          {article.title}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-tinta-500">
          {article.excerpt || 'Baca selengkapnya.'}
        </p>

        <p className="mt-5 border-t border-tinta-200/70 pt-4 text-xs text-tinta-400">
          {tanggal(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
