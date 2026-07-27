'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';

type Row = { id: string; group_name: string; label: string; url: string; sort_order: number };

// A fixed set of known links (not an add/delete list) — the admin just
// changes the URL for each one; the label and its slot are pre-defined.
export function SiteLinksEditor({
  group,
  title,
  labels,
}: {
  group: 'server' | 'social';
  title: string;
  labels: string[];
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingLabel, setSavingLabel] = useState<string | null>(null);
  const [savedLabel, setSavedLabel] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/site_links')
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) throw new Error(data?.error || 'Could not load links');
        return data;
      })
      .then((data: Row[]) => {
        const filtered = Array.isArray(data) ? data.filter((r) => r.group_name === group) : [];
        const byLabel = new Map(filtered.map((r) => [r.label.toLowerCase(), r]));
        const full = labels.map((label, i) => {
          const existing = byLabel.get(label.toLowerCase());
          return existing ?? { id: `missing-${label}`, group_name: group, label, url: '', sort_order: i + 1 };
        });
        setRows(full);
      })
      .catch((e) => setError(e.message || 'Could not load links'));
  }, [group, labels]);

  async function persist(row: Row, url: string) {
    setSavingLabel(row.label);
    setRows((prev) => (prev ? prev.map((r) => (r.label === row.label ? { ...r, url } : r)) : prev));
    try {
      if (row.id.startsWith('missing-')) {
        const res = await fetch('/api/admin/site_links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ group_name: row.group_name, label: row.label, url, sort_order: row.sort_order }),
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || 'Save failed');
        setRows((prev) => (prev ? prev.map((r) => (r.label === row.label ? body : r)) : prev));
      } else {
        const res = await fetch('/api/admin/site_links', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: row.id, url }),
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || 'Save failed');
      }
      setSavedLabel(row.label);
      window.setTimeout(() => setSavedLabel((l) => (l === row.label ? null : l)), 1500);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'A change failed to save.');
    } finally {
      setSavingLabel(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-parchment">{title}</h1>
      </div>
      {error && <p className="mb-4 text-sm text-core-ember border border-core-ember/40 px-4 py-2.5">{error}</p>}
      {rows === null ? (
        <div className="space-y-3">
          {labels.map((label) => (
            <Skeleton key={label} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.label} className="border border-white/10 hover:border-core-ember/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wide text-ash">{row.label}</label>
                <span className="text-xs text-ash">
                  {savingLabel === row.label ? 'Saving…' : savedLabel === row.label ? 'Saved' : ''}
                </span>
              </div>
              <input
                defaultValue={row.url}
                onBlur={(e) => {
                  if (e.target.value !== row.url) persist(row, e.target.value);
                }}
                className="cursor-target w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
