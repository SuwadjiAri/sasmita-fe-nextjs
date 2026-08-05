import { Check } from 'lucide-react';
import SubscribeButton from './SubscribeButton';

type Paket = {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description?: string;
};

async function getPlans() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/subscription-plans`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return { data: [] };
  return res.json();
}

export const metadata = { title: 'Langganan' };

const manfaat = [
  'Akses seluruh karya premium',
  'Membaca tanpa batas',
  'Mendukung penulis SASMITA',
];

export default async function SubscriptionPage() {
  const { data: plans } = await getPlans();

  // Paket di tengah ditandai sebagai pilihan yang disarankan. Bila jumlah
  // paketnya genap, penanda ini dilewatkan saja.
  const indeksSorotan = plans.length % 2 === 1 ? Math.floor(plans.length / 2) : -1;

  return (
    <div>
      <header className="border-b border-tinta-200/70 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
          <p className="label-mikro">Langganan</p>
          <h1 className="mt-3 text-4xl font-semibold text-tinta-900">Pilih Paket Langganan</h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-tinta-600">
            Sebagian besar karya di SASMITA dapat dibaca gratis. Berlangganan
            membuka karya yang ditandai premium oleh penulisnya.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 stagger-children md:grid-cols-3">
          {(plans as Paket[]).map((plan, index) => {
            const disorot = index === indeksSorotan;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border bg-white p-8 ${
                  disorot ? 'border-emas-300 ring-1 ring-emas-300' : 'border-tinta-200/70'
                }`}
              >
                {disorot && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emas-700 px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    Paling Populer
                  </span>
                )}

                <h2 className="label-mikro">{plan.name}</h2>

                <p className="mt-4 font-serif text-4xl font-semibold text-tinta-900">
                  Rp{plan.price.toLocaleString('id-ID')}
                </p>
                <p className="mt-1 text-sm text-tinta-500">untuk {plan.durationDays} hari</p>

                {plan.description && (
                  <p className="mt-4 text-sm leading-relaxed text-tinta-600">{plan.description}</p>
                )}

                <ul className="mt-6 flex-1 space-y-3 border-t border-tinta-200/70 pt-6">
                  {manfaat.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-tinta-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emas-700" />
                      {item}
                    </li>
                  ))}
                </ul>

                <SubscribeButton
                  planId={plan.id}
                  planName={plan.name}
                  className={`mt-8 w-full ${disorot ? 'btn-emas' : 'btn-utama'}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
