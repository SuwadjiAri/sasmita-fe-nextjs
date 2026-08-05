'use client';

interface Props {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ message = 'Memuat...', fullPage = false }: Props) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-tinta-200 border-t-tinta-900"
        role="status"
        aria-label={message}
      />
      <p className="text-sm text-tinta-500">{message}</p>
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
