import Link from 'next/link';
import { Calendar, BookOpen, PenLine } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

async function getUser(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/users/${id}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function AuthorProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <PenLine className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Penulis Tidak Ditemukan</h1>
        <Link href="/" className="text-indigo-600 hover:underline">Kembali ke beranda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300/10 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Avatar + Info */}
        <div className="px-8 pb-8 -mt-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto border-4 border-white shadow-lg">
            <span className="text-3xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h1>

          {user.bio && (
            <p className="text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">{user.bio}</p>
          )}

          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Penulis SASMITA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
