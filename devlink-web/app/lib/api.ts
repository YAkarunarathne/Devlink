export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}