import Link from 'next/link';
import { Calendar, PenLine, ArrowUpRight } from 'lucide-react';

interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  created_at?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function AuthorCard({ author }: { author: Author | null }) {
  if (!author) return null;

  const bergabung = author.created_at
    ? new Date(author.created_at).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-tinta-200/80 bg-white shadow-xs">
      <div className="bg-tinta-950 px-6 py-7 sm:px-8">
        <div className="flex items-start gap-4 sm:gap-5">
          {author.avatar ? (
            <img
              src={`${API}${author.avatar}`}
              alt={author.name}
              className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl object-cover ring-2 ring-emas-400/20"
            />
          ) : (
            <span className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl border border-emas-400/30 bg-white/[0.06] font-serif text-2xl sm:text-3xl font-semibold text-emas-300">
              {author.name.charAt(0).toUpperCase()}
            </span>
          )}

          <div className="min-w-0 pt-0.5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="label-mikro text-emas-300">Tentang Penulis</span>
              <Link
                href={`/authors/${author.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-emas-300 hover:text-white transition"
              >
                Lihat Semua Karya
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <h3 className="mt-1.5 text-xl font-semibold text-white">
              <Link href={`/authors/${author.id}`} className="hover:text-emas-300 transition">
                {author.name}
              </Link>
            </h3>

            {bergabung && (
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-tinta-400">
                <Calendar className="h-3 w-3" />
                Bergabung {bergabung}
              </p>
            )}
          </div>
        </div>
      </div>

      {author.bio ? (
        <div className="px-6 py-6 sm:px-8">
          <p className="font-serif leading-relaxed text-tinta-700 text-sm sm:text-base">
            {author.bio}
          </p>
        </div>
      ) : (
        <div className="px-6 py-4 sm:px-8 text-xs text-tinta-400 italic">
          Penulis aktif di SASMITA Portal Sastra Indonesia.
        </div>
      )}
    </div>
  );
}
