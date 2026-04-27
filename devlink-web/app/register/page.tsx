'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};

    if (!form.name.trim()) {
      e.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters';
    } else if (form.name.trim().length > 50) {
      e.name = 'Name must be under 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      e.name = 'Name can only contain letters and spaces';
    }

    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address';
    }

    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }

    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      router.push('/login');
    } catch (err: any) {
      if (err.message === 'Email already registered') {
        setErrors({ email: 'This email is already registered' });
      } else {
        setErrors({ general: err.message || 'Registration failed' });
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError?: boolean) => ({
    width: '100%',
    background: 'var(--bg-input)',
    border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    marginBottom: '0.4rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const errStyle = {
    color: 'var(--danger)',
    fontSize: '0.78rem',
    marginTop: '0.3rem',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>DevLink</span>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginTop: '1rem' }}>Create account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>Join the dev community</p>
        </div>

        {errors.general && (
          <div style={{ background: '#2a1515', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Name Field */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="Max Verstappen"
              value={form.name}
              onChange={e => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              style={inputStyle(!!errors.name)}
            />
            {errors.name && <p style={errStyle}>{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="max@example.com"
              value={form.email}
              onChange={e => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              style={inputStyle(!!errors.email)}
            />
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => {
                setForm({ ...form, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              style={inputStyle(!!errors.password)}
            />
            {errors.password && <p style={errStyle}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem', background: 'var(--accent)', color: '#0f0f0f', border: 'none', borderRadius: '8px', padding: '0.8rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
