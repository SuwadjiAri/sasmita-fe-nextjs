import Link from 'next/link';

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Penulis Tidak Ditemukan</h1>
        <Link href="/" className="text-indigo-600 hover:underline">Kembali ke beranda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-indigo-600">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        {user.bio && <p className="text-gray-500 mt-2">{user.bio}</p>}
        <p className="text-sm text-gray-400 mt-1">
          Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
