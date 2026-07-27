'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';

type Row = { id: string; server: string; slot_number: number; coins: number; price: number; command_template: string | null };

// Fixed 8 slots per server — unlike other admin tables there's no add/delete,
// just editing coins/price for slots 1-8 (2 INR = 1 coin, enforced by admins
// typing sensible values; not hard-validated since it's an internal tool).
export function CoinPackagesEditor({ server, title }: { server: 'survival' | 'lifesteal'; title: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/coin_packages')
      .then((r) => r.json())
      .then((data: Row[]) => {
        const filtered = Array.isArray(data) ? data.filter((r) => r.server === server) : [];
        const bySlot = new Map(filtered.map((r) => [r.slot_number, r]));
        const full = Array.from({ length: 8 }, (_, i) => {
          const slot = i + 1;
          return (
            bySlot.get(slot) ?? {
              id: `missing-${slot}`,
              server,
              slot_number: slot,
              coins: 0,
              price: 0,
              command_template: null,
            }
          );
        });
        setRows(full);
      })
      .catch(() => setError('Could not load coin packages'));
  }, [server]);

  async function persist(row: Row, patch: Partial<Row>) {
    setSavingSlot(row.slot_number);
    const merged = { ...row, ...patch };
    setRows((prev) => (prev ? prev.map((r) => (r.slot_number === row.slot_number ? merged : r)) : prev));
    try {
      // A slot that doesn't exist yet in the DB (fallback-filled) needs an
      // insert; an already-created slot just gets patched.
      if (row.id.startsWith('missing-')) {
        const res = await fetch('/api/admin/coin_packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            server: merged.server,
            slot_number: merged.slot_number,
            coins: merged.coins,
            price: merged.price,
            command_template: merged.command_template,
          }),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setRows((prev) => (prev ? prev.map((r) => (r.slot_number === row.slot_number ? created : r)) : prev));
      } else {
        const res = await fetch('/api/admin/coin_packages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: row.id, ...patch }),
        });
        if (!res.ok) throw new Error();
      }
    } catch {
      setError('A change failed to save — refresh to check the current state.');
    } finally {
      setSavingSlot(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-parchment mb-6">{title}</h1>
      {error && <p className="mb-4 text-sm text-core-ember border border-core-ember/40 px-4 py-2.5">{error}</p>}
      {rows === null ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((row) => (
            <div key={row.slot_number} className="border border-white/10 hover:border-core-ember/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wide text-ash">Slot {row.slot_number}</span>
                <span className="text-xs text-ash">{savingSlot === row.slot_number ? 'Saving…' : 'Saved'}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wide text-ash">Coins</label>
                  <input
                    type="number"
                    defaultValue={row.coins}
                    onBlur={(e) => persist(row, { coins: Number(e.target.value) || 0 })}
                    className="cursor-target mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-ash">Price (₹)</label>
                  <input
                    type="number"
                    defaultValue={row.price}
                    onBlur={(e) => persist(row, { price: Number(e.target.value) || 0 })}
                    className="cursor-target mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs uppercase tracking-wide text-ash">
                  Delivery Command (blank = manual). Placeholders: {'{player} {coins}'}
                </label>
                <input
                  defaultValue={row.command_template ?? ''}
                  placeholder="eco give {player} {coins}"
                  onBlur={(e) => persist(row, { command_template: e.target.value || null })}
                  className="cursor-target mt-1.5 w-full bg-obsidian border border-white/15 px-3 py-2 text-sm text-parchment focus:border-core-ember outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
