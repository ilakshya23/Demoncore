'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';

type Application = {
  id: string;
  in_game_name: string;
  discord_tag: string;
  age: number | null;
  position: string;
  experience: string;
  why_you: string;
  status: string;
  created_at: string;
};

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<Application[] | null>(null);

  useEffect(() => {
    fetch('/api/admin/staff_applications')
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data.sort((a, b) => b.created_at.localeCompare(a.created_at)) : []));
  }, []);

  async function setStatus(id: string, status: string) {
    setRows((prev) => (prev ? prev.map((r) => (r.id === id ? { ...r, status } : r)) : prev)); // optimistic
    await fetch('/api/admin/staff_applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-parchment mb-6">Staff Applications</h1>
      {rows === null ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-ash text-sm">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.id} className="border border-white/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-parchment font-display">{r.in_game_name}</span>
                  <span className="text-ash text-sm ml-2">{r.discord_tag}</span>
                  <span className="text-core-ember text-xs uppercase tracking-wide ml-3">{r.position}</span>
                </div>
                <div className="flex gap-2">
                  {['reviewed', 'accepted', 'rejected'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(r.id, s)}
                      className={`text-xs uppercase tracking-wide px-2.5 py-1 border ${
                        r.status === s ? 'border-core-ember text-core-ember' : 'border-white/15 text-ash hover:text-parchment'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-ash mt-3"><span className="text-parchment">Experience:</span> {r.experience}</p>
              <p className="text-sm text-ash mt-2"><span className="text-parchment">Why them:</span> {r.why_you}</p>
              <p className="text-xs text-ash/60 mt-3">{new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
