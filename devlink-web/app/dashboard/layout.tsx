import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/jobs" style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>DevLink</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {[
            { href: '/jobs', label: 'Browse' },
            { href: '/dashboard/profile', label: 'My Profile' },
            { href: '/dashboard/jobs/new', label: 'Post a Job' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>{label}</Link>
          ))}
          <LogoutButton />
        </div>
      </nav>
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>{children}</main>
    </div>
  );
}
