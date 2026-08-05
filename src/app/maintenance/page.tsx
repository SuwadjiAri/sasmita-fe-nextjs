import type { Metadata } from 'next';
import DevelopmentScreen from '@/components/DevelopmentScreen';

export const metadata: Metadata = {
  title: 'Sedang Dalam Pengembangan',
  robots: { index: false, follow: false },
};

// Halaman ini hanya dicapai lewat rewrite dari middleware, lihat src/middleware.ts.
export default function MaintenancePage() {
  return <DevelopmentScreen />;
}
