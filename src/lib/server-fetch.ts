// API yang tidak terjangkau jadi null, bukan galat yang menggagalkan build.
export async function ambilJson<T>(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T | null> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smita.id';
    const targetUrl = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `${siteUrl.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
    const res = await fetch(targetUrl, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
