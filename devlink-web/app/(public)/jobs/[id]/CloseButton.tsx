'use client';
import { useRouter } from 'next/navigation';

export default function CloseButton({ jobId, token }: { jobId: string; token: string }) {
  const router = useRouter();

  async function handleClose() {
    if (!confirm('Close this listing?')) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.push('/jobs');
    } else {
      alert('Failed to close listing. Please try again.');
    }
  }

  return (
    <button
      onClick={handleClose}
      style={{
        background: 'transparent',
        border: '1px solid var(--danger)',
        color: 'var(--danger)',
        padding: '0.6rem 1.4rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      Close listing
    </button>
  );
}
