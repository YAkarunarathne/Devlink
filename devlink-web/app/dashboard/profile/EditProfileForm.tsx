'use client';
import { useState } from 'react';

export default function EditProfileForm({ user, token }: { user: any; token: string }) {
  const profile = user?.profile || {};

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: profile.bio || '',
    techStack: profile.techStack?.join(', ') || '',
    githubUrl: profile.githubUrl || '',
    websiteUrl: profile.websiteUrl || '',
    avatarUrl: profile.avatarUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) {
      e.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      e.name = 'Must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      e.name = 'Letters and spaces only';
    }
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email';
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setSuccess(false);
    setErrors({});

    try {
      // 1. Update name + email
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
          }),
        }
      );
      const userData = await userRes.json();
      if (!userRes.ok) {
        if (userData.message?.includes('Email already')) {
          setErrors({ email: 'This email is already in use' });
        } else {
          setErrors({ general: userData.message || 'Failed to update account' });
        }
        return;
      }

      // 2. Update profile fields
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bio: form.bio,
            techStack: form.techStack
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean),
            githubUrl: form.githubUrl,
            websiteUrl: form.websiteUrl,
            avatarUrl: form.avatarUrl,
          }),
        }
      );
      const profileData = await profileRes.json();
      if (!profileRes.ok) throw profileData;

      setSuccess(true);
    } catch (err: any) {
      setErrors({ general: err.message || 'Something went wrong' });
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
    fontSize: '0.78rem',
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
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
    }}>
      {success && (
        <div style={{ background: '#1a2a1a', border: '1px solid #4a7a4a', color: '#7dd37d', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.2rem' }}>
          ✅ Profile saved successfully!
        </div>
      )}
      {errors.general && (
        <div style={{ background: '#2a1515', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.2rem' }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        {/* Row 1 — Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              style={inputStyle(!!errors.name)}
            />
            {errors.name && <p style={errStyle}>{errors.name}</p>}
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={e => {
                setForm({ ...form, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              style={inputStyle(!!errors.email)}
            />
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>
        </div>

        {/* Row 2 — Bio */}
        <div>
          <label style={labelStyle}>Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            style={{ ...inputStyle(), height: '110px', resize: 'none' }}
          />
        </div>

        {/* Row 3 — Tech Stack */}
        <div>
          <label style={labelStyle}>
            Tech Stack{' '}
            <span style={{ opacity: 0.5, textTransform: 'none', letterSpacing: 0 }}>
              (comma-separated)
            </span>
          </label>
          <input
            value={form.techStack}
            onChange={e => setForm({ ...form, techStack: e.target.value })}
            placeholder="React, Node.js, TypeScript"
            style={inputStyle()}
          />
        </div>

        {/* Row 4 — GitHub + Website */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input
              value={form.githubUrl}
              onChange={e => setForm({ ...form, githubUrl: e.target.value })}
              placeholder="https://github.com/handle"
              style={inputStyle()}
            />
          </div>
          <div>
            <label style={labelStyle}>Website URL</label>
            <input
              value={form.websiteUrl}
              onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
              placeholder="https://yoursite.com"
              style={inputStyle()}
            />
          </div>
        </div>

        {/* Row 5 — Avatar URL */}
        <div>
          <label style={labelStyle}>Avatar URL</label>
          <input
            value={form.avatarUrl}
            onChange={e => setForm({ ...form, avatarUrl: e.target.value })}
            placeholder="https://..."
            style={inputStyle()}
          />
        </div>

        {/* Save button */}
        <div style={{ paddingTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--accent)',
              color: '#0f0f0f',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 2rem',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
