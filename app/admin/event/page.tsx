'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';

type EventRow = {
  id: string;
  title: string;
  description: string;
  banner_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  rules: string[];
  rewards: string[];
};

export default function AdminEventPage() {
  const [event, setEvent] = useState<EventRow | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/admin/current_event')
      .then((r) => r.json())
      .then((rows) => setEvent(Array.isArray(rows) ? rows[0] : rows));
  }, []);

  function set<K extends keyof EventRow>(key: K, value: EventRow[K]) {
    setEvent((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!event) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/admin/current_event', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error();
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('error');
    }
  }

  if (!event) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-parchment">Current Event</h1>
        <button
          onClick={save}
          className="border border-core-ember px-4 py-2 text-xs uppercase tracking-wide text-core-ember hover:bg-core-ember hover:text-void transition-colors"
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
      {status === 'error' && (
        <p className="mb-4 text-sm text-core-ember border border-core-ember/40 px-4 py-2.5">
          Couldn't save — try again.
        </p>
      )}

      <div className="space-y-5 border border-white/10 p-6">
        <div>
          <label className="text-xs uppercase tracking-wide text-ash">Event Title</label>
          <input
            value={event.title}
            onChange={(e) => set('title', e.target.value)}
            className="mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-ash">Description</label>
          <textarea
            value={event.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs uppercase tracking-wide text-ash">Rules (one per line)</label>
            <textarea
              value={event.rules.join('\n')}
              onChange={(e) => set('rules', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
              rows={5}
              className="mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ash">Rewards (one per line)</label>
            <textarea
              value={event.rewards.join('\n')}
              onChange={(e) => set('rewards', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
              rows={5}
              className="mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
