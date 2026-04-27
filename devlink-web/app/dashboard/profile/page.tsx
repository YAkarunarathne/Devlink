import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditProfileForm from './EditProfileForm';

function getTokenPayload(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

async function getProfile(userId: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/profile`,
    {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) redirect('/login');

  const payload = getTokenPayload(token);
  const user = await getProfile(payload.sub, token);

  return (
    <>
      {/* Header — matches same spacing as other dashboard pages */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          My Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.3rem' }}>
          Manage your account info and portfolio details
        </p>
      </div>

      {/* User identity card — same card style as job cards */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: '#0f0f0f', flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
            {user?.name}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
            {user?.email}
          </p>
        </div>
      </div>

      {/* Edit form */}
      <EditProfileForm user={user} token={token} />
    </>
  );
}
