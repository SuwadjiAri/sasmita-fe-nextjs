import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import SubscribeButton from './SubscribeButton';

async function getPlans() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/subscription-plans`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return { data: [] };
  return res.json();
}

export const metadata = { title: 'Subscription' };

const planStyles = [
  {
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500',
    border: 'border-blue-200 hover:border-blue-400',
    badge: null,
    button: 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25',
  },
  {
    icon: Zap,
    gradient: 'from-indigo-500 to-purple-600',
    border: 'border-indigo-300 ring-2 ring-indigo-500/20 hover:ring-indigo-500/40',
    badge: 'Paling Populer',
    button: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25',
  },
  {
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-200 hover:border-amber-400',
    badge: 'Hemat',
    button: 'bg-amber-600 hover:bg-amber-700 hover:shadow-amber-500/25',
  },
];

const benefits = [
  'Akses semua artikel premium',
  'Baca tanpa batas',
  'Dukung penulis SASMITA',
];

export default async function SubscriptionPage() {
  const { data: plans } = await getPlans();

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pilih Paket Langganan</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Berlangganan untuk akses semua artikel premium di SASMITA.COM
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        {plans.map((plan: { id: number; name: string; price: number; durationDays: number; description?: string }, index: number) => {
          const style = planStyles[index] || planStyles[0];
          const Icon = style.icon;

          return (
            <div
              key={plan.id}
              className={`card-hover relative bg-white border-2 rounded-2xl p-8 text-center flex flex-col ${style.border}`}
            >
              {/* Badge */}
              {style.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`bg-gradient-to-r ${style.gradient} text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-lg`}>
                    {style.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-5 mt-2`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Plan info */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">Rp{plan.price.toLocaleString('id-ID')}</span>
                <span className="text-gray-400 text-sm ml-1">/ {plan.durationDays} hari</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

              {/* Benefits */}
              <ul className="space-y-3 mb-8 text-left flex-1">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <SubscribeButton
                planName={plan.name}
                className={`block w-full text-white py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg ${style.button}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
