import Link from 'next/link';
import { Calendar, PenLine } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getUser(id: string) {
  const res = await fetch(`${API}/users/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function AuthorProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <PenLine className="mx-auto h-10 w-10 text-tinta-300" />
        <h1 className="mt-5 text-2xl font-semibold text-tinta-900">Penulis tidak ditemukan</h1>
        <p className="mt-2 text-tinta-600">Profil yang Anda cari tidak ada atau sudah dihapus.</p>
        <Link href="/" className="btn-utama mt-6">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const bergabung = new Date(user.created_at).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="kartu overflow-hidden">
        <div className="bg-tinta-950 px-8 py-10">
          <div className="flex items-start gap-5">
            {user.avatar ? (
              <img
                src={`${API}${user.avatar}`}
                alt=""
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-emas-400/30 bg-white/[0.06] font-serif text-3xl font-semibold text-emas-300">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}

            <div className="min-w-0 pt-1">
              <p className="label-mikro text-emas-300">Penulis</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">{user.name}</h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-tinta-400">
                <Calendar className="h-3.5 w-3.5" />
                Bergabung {bergabung}
              </p>
            </div>
          </div>
        </div>

        {user.bio && (
          <div className="px-8 py-8">
            <h2 className="label-mikro">Tentang</h2>
            <p className="mt-3 font-serif leading-relaxed text-tinta-700">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
