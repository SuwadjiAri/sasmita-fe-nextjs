import Link from 'next/link';

async function getPlans() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/subscription-plans`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return { data: [] };
  return res.json();
}

export const metadata = { title: 'Subscription' };

export default async function SubscriptionPage() {
  const { data: plans } = await getPlans();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Paket Langganan</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Berlangganan untuk akses semua artikel premium di SASMITA.COM
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan: { id: number; name: string; price: number; durationDays: number; description?: string }, index: number) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-xl p-8 text-center ${
              index === 1 ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
            }`}
          >
            {index === 1 && (
              <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Populer
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-indigo-600 mb-1">
              Rp{plan.price.toLocaleString('id-ID')}
            </p>
            <p className="text-gray-500 text-sm mb-6">{plan.durationDays} hari</p>
            <p className="text-gray-500 text-sm mb-8">{plan.description}</p>
            <Link
              href="/login"
              className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
            >
              Pilih Paket
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
