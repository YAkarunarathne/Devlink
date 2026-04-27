'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <button onClick={handleLogout} style={{ background: 'var(--accent)', color: '#0f0f0f', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
      Logout
    </button>
  );
}
