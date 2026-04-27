import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getProfile(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/profile`,
    { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

async function getJobs(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/jobs?status=OPEN&limit=50`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.data.filter((j: any) => j.postedById === userId);
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) redirect('/login');

  const { id } = await params;
  const user = await getProfile(id, token);
  if (!user) notFound();

  const jobs = await getJobs(id);
  const profile = user.profile;

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#0f0f0f', flexShrink: 0 }}>
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
            {user.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <p style={{ color: 'var(--text)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {profile.bio}
        </p>
      )}

      {/* Tech Stack */}
      {profile?.techStack?.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
            Tech Stack
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.techStack.map((tech: string) => (
              <span key={tech} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.85rem', padding: '0.3rem 0.8rem', borderRadius: '999px' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(profile?.githubUrl || profile?.websiteUrl) && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              GitHub →
            </a>
          )}
          {profile.websiteUrl && (
            <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Website →
            </a>
          )}
        </div>
      )}

      {/* Open Listings */}
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
        Open Listings
      </h2>
      {jobs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No open listings.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jobs.map((job: any) => (
            <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    {job.title}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    {job.location}
                  </p>
                </div>
                <span style={{ background: '#1e2a1a', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                  {job.type.replace('_', ' ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
