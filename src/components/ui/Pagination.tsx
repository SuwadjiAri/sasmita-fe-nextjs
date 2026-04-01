'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Rows3 } from 'lucide-react';

interface Props {
  page: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
}

export default function Pagination({
  page, lastPage, total, perPage,
  onPageChange, onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
}: Props) {
  if (total === 0) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: info + per page */}
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-900">{start}-{end}</span> dari <span className="font-semibold text-gray-900">{total}</span>
          </p>
          {onPerPageChange && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
              <Rows3 className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(parseInt(e.target.value))}
                className="text-sm bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt} / halaman</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: page navigation */}
        {lastPage > 1 && (
          <div className="flex items-center gap-1">
            {/* First page */}
            <button
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              className="p-2 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
              title="Halaman pertama"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-0.5 mx-1">
              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter(p => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === 'string' ? (
                    <span key={`dot-${i}`} className="px-1.5 text-gray-300 text-sm">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        p === page
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                          : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            {/* Next */}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= lastPage}
              className="p-2 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
              title="Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last page */}
            <button
              onClick={() => onPageChange(lastPage)}
              disabled={page >= lastPage}
              className="p-2 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
              title="Halaman terakhir"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
