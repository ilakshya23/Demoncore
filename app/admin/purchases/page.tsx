'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';

type PurchaseRequest = {
  id: string;
  item_type: 'rank' | 'crate_key';
  item_name: string;
  server: string | null;
  quantity: number;
  amount: number;
  minecraft_username: string;
  email: string;
  status: string;
  created_at: string;
};

const STATUSES = ['new', 'contacted', 'completed', 'cancelled'];

export default function AdminPurchasesPage() {
  const [rows, setRows] = useState<PurchaseRequest[] | null>(null);

  useEffect(() => {
    fetch('/api/admin/purchase_requests')
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data.sort((a, b) => b.created_at.localeCompare(a.created_at)) : []));
  }, []);

  async function setStatus(id: string, status: string) {
    setRows((prev) => (prev ? prev.map((r) => (r.id === id ? { ...r, status } : r)) : prev));
    await fetch('/api/admin/purchase_requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  }

  async function remove(id: string) {
    setRows((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    await fetch(`/api/admin/purchase_requests?id=${id}`, { method: 'DELETE' });
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-parchment mb-6">Purchase Requests</h1>
      <p className="text-ash text-sm mb-6">
        No payment gateway is wired up yet — these are manual orders. Contact the player, take
        payment however you prefer, deliver the rank/crate key in-game, then mark it completed.
      </p>
      {rows === null ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-ash text-sm">No purchase requests yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.id} className="border border-white/10 hover:border-core-ember/60 focus-within:border-core-ember p-5 transition-colors">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-parchment font-display">
                    {r.item_name} {r.quantity > 1 ? `× ${r.quantity}` : ''}
                  </span>
                  <span className="text-core-ember text-sm ml-2 font-mono">₹{r.amount}</span>
                  <span className="text-ash text-xs ml-2 uppercase tracking-wide">
                    {r.item_type === 'crate_key' ? 'Crate Key' : 'Rank'} · {r.server}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value)}
                    className="cursor-target bg-obsidian border border-white/15 px-2 py-1 text-xs text-parchment focus:border-core-ember outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => remove(r.id)} className="cursor-target text-xs uppercase tracking-wide text-ash hover:text-core-ember">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-ash mt-2">
                IGN: <span className="text-parchment">{r.minecraft_username}</span> · {r.email}
              </p>
              <p className="text-xs text-ash/60 mt-3">{new Date(r.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
