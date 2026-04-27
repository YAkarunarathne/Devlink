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
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax))
      e.salaryMin = 'Min salary cannot exceed max';
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
        job
          ? `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
        {
          method: job ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        if (Array.isArray(data.message)) {
          const fieldErrors: Record<string, string> = {};
          data.message.forEach((msg: string) => {
            const field = msg.split(' ')[0].toLowerCase();
            fieldErrors[field] = msg;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.message });
        }
        return;
      }

      router.push(`/jobs/${data.id}`);
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          className={`w-full border rounded-lg px-4 py-2 ${errors.title ? 'border-red-400' : ''}`}
          placeholder="e.g. Senior React Developer"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className={`w-full border rounded-lg px-4 py-2 h-36 resize-none ${errors.description ? 'border-red-400' : ''}`}
          placeholder="Describe the role, requirements, and responsibilities..."
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            {JOB_TYPES.map(t => (
              <option key={t} value={t}>{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            className={`w-full border rounded-lg px-4 py-2 ${errors.location ? 'border-red-400' : ''}`}
            placeholder="Remote / Colombo, Sri Lanka"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Min Salary ($)</label>
          <input
            type="number"
            className={`w-full border rounded-lg px-4 py-2 ${errors.salaryMin ? 'border-red-400' : ''}`}
            placeholder="e.g. 60000"
            value={form.salaryMin}
            onChange={e => setForm({ ...form, salaryMin: e.target.value })}
          />
          {errors.salaryMin && <p className="text-red-500 text-xs mt-1">{errors.salaryMin}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Salary ($)</label>
          <input
            type="number"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="e.g. 90000"
            value={form.salaryMax}
            onChange={e => setForm({ ...form, salaryMax: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
        </label>
        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="React, TypeScript, Node.js"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Saving...' : job ? 'Update Listing' : 'Post Job'}
      </button>
    </form>
  );
}