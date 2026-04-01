'use client';

import { PenLine } from 'lucide-react';

interface Props {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ message = 'Memuat...', fullPage = false }: Props) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-14 h-14 rounded-full border-[3px] border-indigo-100 dark:border-indigo-900/30" />
        {/* Spinning ring */}
        <div className="absolute inset-0 w-14 h-14 rounded-full border-[3px] border-transparent border-t-indigo-600 animate-spin" />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PenLine className="w-5 h-5 text-indigo-500 animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="py-16 flex items-center justify-center">
      {content}
    </div>
  );
}
