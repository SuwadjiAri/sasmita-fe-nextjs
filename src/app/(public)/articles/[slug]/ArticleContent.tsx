'use client';

import BookmarkButton from '@/components/ui/BookmarkButton';
import CommentSection from '@/components/ui/CommentSection';
import PremiumGate from '@/components/ui/PremiumGate';
import AdSlot, { AdsProvider } from '@/components/ui/AdSlot';
import ContentProtection from '@/components/ui/ContentProtection';

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  isPremium: boolean;
  publishedAt?: string;
  viewCount: number;
}

export default function ArticleContent({ article }: { article: Article }) {
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
        {/* Lencana premium sudah tampil di kepala artikel. */}
        <div className="mb-8 flex items-center gap-3">
          <BookmarkButton articleId={article.id} />
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
