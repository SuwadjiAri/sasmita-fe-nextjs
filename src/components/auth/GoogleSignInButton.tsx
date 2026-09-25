'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

interface GoogleSignInButtonProps {
  text?: string;
  onError?: (err: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
              locale?: string;
            }
          ) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton({
  text = 'Masuk dengan Google',
  onError,
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      setLoading(true);
      await loginWithGoogle({ credential: response.credential });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login dengan Google gagal.';
      if (onError) onError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;

    // Load Google Identity Services script
    const scriptId = 'google-jssdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogle();
      };
      document.body.appendChild(script);
    } else if (window.google) {
      initGoogle();
    }

    function initGoogle() {
      if (window.google?.accounts && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 320,
          locale: 'id',
        });
      }
    }
  }, [clientId]);

  // Fallback tombol visual bila Google Client ID belum dipasang atau script belum termuat
  return (
    <div className="w-full">
      {clientId ? (
        <div className="flex justify-center" ref={buttonRef}>
          {loading && <p className="text-xs text-tinta-500">Memproses akun Google...</p>}
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            if (onError) {
              onError(
                'Google Client ID belum dikonfigurasi di file environment (.env). Silakan daftarkan Client ID di Google Cloud Console.'
              );
            }
          }}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-tinta-200/90 bg-white px-4 py-2.5 text-sm font-medium text-tinta-800 shadow-xs transition hover:bg-tinta-50 hover:border-tinta-300"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{loading ? 'Memproses...' : text}</span>
        </button>
      )}
    </div>
  );
}
