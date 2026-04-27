import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import CloseButton from './CloseButton';

async function getJob(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

function getTokenPayload(token: string) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = token ? getTokenPayload(token) : null;
  const isOwner = payload?.sub === job.postedById;

  return (
    <>
      <Link href="/jobs" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
        ← Back to jobs
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          {job.title}
        </h1>
        <span style={{ background: '#1e2a1a', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.9rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
          {job.type.replace('_', ' ')}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{job.postedBy.name}</span>
        <span> {job.location}</span>
        <span> {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      {(job.salaryMin || job.salaryMax) && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
           {job.salaryMin ? `Rs${job.salaryMin.toLocaleString()}` : ''}
          {job.salaryMin && job.salaryMax ? ' – ' : ''}
          {job.salaryMax ? `Rs${job.salaryMax.toLocaleString()}` : ''}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {job.tags.map((tag: string) => (
          <span key={tag} style={{ background: '#1e2a1a', color: 'var(--accent)', fontSize: '0.75rem', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
          {job.description}
        </p>
      </div>

      {isOwner && token && (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            style={{ background: 'var(--accent)', color: '#0f0f0f', padding: '0.6rem 1.4rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', textDecoration: 'none' }}
          >
            Edit listing
          </Link>
          <CloseButton jobId={job.id} token={token} />
        </div>
      )}
    </>
  );
}
