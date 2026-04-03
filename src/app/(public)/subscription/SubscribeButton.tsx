'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface Props {
  planId: number;
  planName: string;
  className: string;
}

export default function SubscribeButton({ planId, planName, className }: Props) {
  const router = useRouter();
  const { token } = useAuthStore();

  const handleClick = () => {
    if (token) {
      router.push(`/dashboard/subscription?plan=${planId}`);
    } else {
      router.push('/login');
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      Pilih {planName}
    </button>
  );
}
