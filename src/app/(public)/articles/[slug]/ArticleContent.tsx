'use client';

import BookmarkButton from '@/components/ui/BookmarkButton';
import CommentSection from '@/components/ui/CommentSection';
import PremiumGate from '@/components/ui/PremiumGate';
import AdSlot, { AdsProvider } from '@/components/ui/AdSlot';
import ContentProtection from '@/components/ui/ContentProtection';
import ShareButtons from '@/components/ui/ShareButtons';
import AuthorCard from '@/components/ui/AuthorCard';

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  isPremium: boolean;
  publishedAt?: string;
  viewCount: number;
}

interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
  created_at?: string;
}

export default function ArticleContent({
  article,
  author = null,
}: {
  article: Article;
  author?: Author | null;
}) {
  const contentBlock = (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: article.content }}
    />
  );

  return (
    <AdsProvider>
    <div className="flex gap-6">
      {/* Sidebar Kiri - Iklan */}
      <aside className="hidden lg:block w-[160px] flex-shrink-0">
        <div className="sticky top-24">
          <AdSlot position="sidebar_left" />
        </div>
      </aside>

      {/* Konten Artikel */}
      <div className="flex-1 min-w-0 max-w-3xl mx-auto">
        {/* Lencana premium & bilah aksi (Bookmark + Share) */}
        <div className="mb-8 flex items-center justify-between gap-3 flex-wrap">
          <BookmarkButton articleId={article.id} />
          <ShareButtons title={article.title} />
        </div>

        <AdSlot position="header" />

        <ContentProtection>
          {article.isPremium ? (
            <PremiumGate>{contentBlock}</PremiumGate>
          ) : (
            contentBlock
          )}
        </ContentProtection>

        <AdSlot position="in_article" />

        {/* Bilah Bagikan di akhir artikel */}
        <div className="my-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-tinta-200/60 bg-latar/50 p-4">
          <p className="text-xs sm:text-sm font-medium text-tinta-700">
            Suka dengan karya sastra ini? Bagikan kepada pembaca lainnya:
          </p>
          <ShareButtons title={article.title} />
        </div>

        {/* Profil Penulis sebelum komentar */}
        <AuthorCard author={author} />

        <CommentSection articleId={article.id} />
      </div>

      {/* Sidebar Kanan - Iklan */}
      <aside className="hidden lg:block w-[160px] flex-shrink-0">
        <div className="sticky top-24">
          <AdSlot position="sidebar_right" />
        </div>
      </aside>
    </div>
    </AdsProvider>
  );
}
