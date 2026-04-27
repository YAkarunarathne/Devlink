import Link from 'next/link';

async function getJobs(search?: string, type?: string) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (type) params.set('type', type);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

const typeColors: Record<string, string> = {
  FULL_TIME: '#d4f04c',
  PART_TIME: '#7dd3fc',
  CONTRACT: '#fbbf24',
  INTERNSHIP: '#c4b5fd',
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>;
}) {
  const { search, type } = await searchParams;
  const { data: jobs, total } = await getJobs(search, type);
  const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];

  return (
    <>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)' }}>
          Browse Jobs
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          {total} open listing{total !== 1 ? 's' : ''}
        </p>
      </div>

      <form method="GET" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <input
          name="search"
          defaultValue={search}
          placeholder="Search jobs..."
          style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.7rem 1rem', color: 'var(--text)', fontSize: '0.95rem', outline: 'none' }}
        />
        <select
          name="type"
          defaultValue={type}
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.7rem 1rem', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
        >
          <option value="">All types</option>
          {jobTypes.map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>
        <button
          type="submit"
          style={{ background: 'var(--accent)', color: '#0f0f0f', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer' }}
        >
          Search
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {jobs.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>No listings found.</p>
        )}
        {jobs.map((job: any) => (
          <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1.5rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                    {job.title}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    {job.postedBy.name} · {job.location}
                  </p>
                </div>
                <span style={{ background: typeColors[job.type] + '22', color: typeColors[job.type], fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                  {job.type.replace('_', ' ')}
                </span>
              </div>
              {(job.salaryMin || job.salaryMax) && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.6rem' }}>
                   {job.salaryMin ? `Rs${job.salaryMin.toLocaleString()}` : ''}
                  {job.salaryMin && job.salaryMax ? ' – ' : ''}
                  {job.salaryMax ? `Rs${job.salaryMax.toLocaleString()}` : ''}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {job.tags.map((tag: string) => (
                  <span key={tag} style={{ background: '#1e2a1a', color: 'var(--accent)', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
