import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import JobForm from '../../JobForm';

function getTokenPayload(token: string) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

async function getJob(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  return res.json();
}

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');

  const payload = getTokenPayload(token);
  const job = await getJob(id);
  if (!job) notFound();
  if (job.postedById !== payload.sub) redirect('/jobs');

  return (
    <div>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem' }}>Edit Listing</h1>
      <JobForm job={job} token={token} />
    </div>
  );
}
