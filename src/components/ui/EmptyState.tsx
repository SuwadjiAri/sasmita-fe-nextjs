'use client';

import Link from 'next/link';
import { FileText, Bookmark, Bell, BarChart3, Search, BookOpen } from 'lucide-react';

interface Props {
  icon?: 'article' | 'bookmark' | 'notification' | 'stats' | 'search' | 'category';
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

const icons = {
  article: FileText,
  bookmark: Bookmark,
  notification: Bell,
  stats: BarChart3,
  search: Search,
  category: BookOpen,
};

export default function EmptyState({ icon = 'article', title, description, actionLabel, actionHref }: Props) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
