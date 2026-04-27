import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import JobForm from '../JobForm';

export default async function NewJobPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');

  return (
    <div>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '2rem' }}>Post a New Job</h1>
      <JobForm token={token} />
    </div>
  );
}
