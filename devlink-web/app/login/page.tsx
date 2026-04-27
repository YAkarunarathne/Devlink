'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      router.push('/dashboard/profile');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>DevLink</span>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginTop: '1rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background: '#2a1515', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                required
                value={(form as any)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.7rem 1rem', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem', background: 'var(--accent)', color: '#0f0f0f', border: 'none', borderRadius: '8px', padding: '0.8rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          No account?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
