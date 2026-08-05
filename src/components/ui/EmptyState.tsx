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
    <div className="rounded-xl border border-dashed border-tinta-300 px-6 py-16 text-center">
      <Icon className="mx-auto h-10 w-10 text-tinta-300" />
      <h3 className="mt-4 text-lg font-semibold text-tinta-900">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-tinta-500">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-utama mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
