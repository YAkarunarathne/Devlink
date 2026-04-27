import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/jobs" style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>
          DevLink
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {token ? (
            <>
              <Link href="/jobs" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>Browse Jobs</Link>
              <Link href="/dashboard/profile" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>My Profile</Link>
              <Link href="/dashboard/jobs/new" style={{ background: 'var(--accent)', color: '#0f0f0f', padding: '0.4rem 1rem', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Post a Job</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
              <Link href="/register" style={{ background: 'var(--accent)', color: '#0f0f0f', padding: '0.4rem 1rem', borderRadius: '8px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Page content — consistent max-width and padding */}
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}
