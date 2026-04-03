'use client';

import BookmarkButton from '@/components/ui/BookmarkButton';
import CommentSection from '@/components/ui/CommentSection';
import PremiumGate from '@/components/ui/PremiumGate';
import AdSlot from '@/components/ui/AdSlot';
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
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: article.content }}
    />
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <BookmarkButton articleId={article.id} />
        {article.isPremium && (
          <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
            Premium
          </span>
        )}
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
    </>
  );
}
