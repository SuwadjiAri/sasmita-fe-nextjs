'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface Props {
  planName: string;
  className: string;
}

export default function SubscribeButton({ planName, className }: Props) {
  const router = useRouter();
  const { token } = useAuthStore();

  const handleClick = () => {
    if (token) {
      router.push('/dashboard/subscription');
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
