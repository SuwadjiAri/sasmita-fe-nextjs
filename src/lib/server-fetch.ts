// API yang tidak terjangkau jadi null, bukan galat yang menggagalkan build.
export async function ambilJson<T>(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
