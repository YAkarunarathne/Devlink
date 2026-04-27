'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];

export default function JobForm({ job, token }: { job?: any; token?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: job?.title || '',
    description: job?.description || '',
    type: job?.type || 'FULL_TIME',
    location: job?.location || '',
    salaryMin: job?.salaryMin || '',
    salaryMax: job?.salaryMax || '',
    tags: job?.tags?.join(', ') || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) e.salaryMin = 'Min cannot exceed max';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setErrors({});

    const body = {
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(
        job ? `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}` : `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
        { method: job ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }
      );
      const data = await res.json();
      if (!res.ok) {
        if (Array.isArray(data.message)) {
          const fieldErrors: Record<string, string> = {};
          data.message.forEach((msg: string) => { fieldErrors[msg.split(' ')[0].toLowerCase()] = msg; });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.message });
        }
        return;
      }
      router.push(`/jobs/${data.id}`);
    } catch {
      setErrors({ general: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError?: boolean) => ({ width: '100%', background: 'var(--bg-input)', border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`, borderRadius: '8px', padding: '0.7rem 1rem', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' });
  const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
  const errStyle = { color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.3rem' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '560px' }}>
      {errors.general && <div style={{ background: '#2a1515', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>{errors.general}</div>}

      <div>
        <label style={labelStyle}>Job Title</label>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior React Developer" style={inputStyle(!!errors.title)} />
        {errors.title && <p style={errStyle}>{errors.title}</p>}
      </div>

      <div>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the role..." style={{ ...inputStyle(!!errors.description), height: '140px', resize: 'none' }} />
        {errors.description && <p style={errStyle}>{errors.description}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Job Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle()}>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Location</label>
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Remote / London, UK" style={inputStyle(!!errors.location)} />
          {errors.location && <p style={errStyle}>{errors.location}</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Min Salary ($)</label>
          <input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} placeholder="60000" style={inputStyle(!!errors.salaryMin)} />
          {errors.salaryMin && <p style={errStyle}>{errors.salaryMin}</p>}
        </div>
        <div>
          <label style={labelStyle}>Max Salary ($)</label>
          <input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} placeholder="90000" style={inputStyle()} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Tags <span style={{ opacity: 0.5, textTransform: 'none' }}>(comma-separated)</span></label>
        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, TypeScript, Node.js" style={inputStyle()} />
      </div>

      <button type="submit" disabled={loading} style={{ background: 'var(--accent)', color: '#0f0f0f', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, alignSelf: 'flex-start' }}>
        {loading ? 'Saving...' : job ? 'Update Listing' : 'Post Job'}
      </button>
    </form>
  );
}
