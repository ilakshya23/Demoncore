'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';

type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminSubmissionsPage() {
  const [rows, setRows] = useState<Submission[] | null>(null);

  useEffect(() => {
    fetch('/api/admin/contact_submissions')
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data.sort((a, b) => b.created_at.localeCompare(a.created_at)) : []));
  }, []);

  async function remove(id: string) {
    setRows((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    await fetch(`/api/admin/contact_submissions?id=${id}`, { method: 'DELETE' });
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-parchment mb-6">Contact Submissions</h1>
      {rows === null ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-ash text-sm">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.id} className="border border-white/10 hover:border-core-ember/60 focus-within:border-core-ember p-5 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-parchment font-display">{r.name}</span>
                  <span className="text-ash text-sm ml-2">{r.email}</span>
                </div>
                <button onClick={() => remove(r.id)} className="cursor-target text-xs uppercase tracking-wide text-ash hover:text-core-ember">
                  Delete
                </button>
              </div>
              {r.subject && <p className="text-sm text-core-ember mt-2">{r.subject}</p>}
              <p className="text-sm text-ash mt-2 whitespace-pre-line">{r.message}</p>
              <p className="text-xs text-ash/60 mt-3">{new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
