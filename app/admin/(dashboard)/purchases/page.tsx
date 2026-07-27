'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui';

type PurchaseRequest = {
  id: string;
  item_type: 'rank' | 'crate_key' | 'coin_package';
  item_name: string;
  server: string | null;
  quantity: number;
  amount: number;
  buyer_name: string | null;
  minecraft_username: string;
  discord_username: string | null;
  phone_number: string | null;
  email: string | null;
  status: string;
  delivered_at: string | null;
  created_at: string;
};

const STATUSES = ['new', 'paid', 'contacted', 'completed', 'cancelled'];

const ITEM_TYPE_LABELS: Record<string, string> = {
  crate_key: 'Crate Key',
  rank: 'Rank',
  coin_package: 'Coins',
};

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
        Orders marked "paid" went through Razorpay — deliver the item in-game, then mark it
        completed. Orders still "new" haven't paid yet (or Razorpay isn't configured) — reach out
        on Discord to arrange payment first.
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
                    {ITEM_TYPE_LABELS[r.item_type] ?? r.item_type} · {r.server}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {r.delivered_at && (
                    <span className="text-xs uppercase tracking-wide text-emerald-400/80">Auto-delivered</span>
                  )}
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
                {r.buyer_name && <>{r.buyer_name} · </>}
                IGN: <span className="text-parchment">{r.minecraft_username}</span>
                {r.discord_username && <> · Discord: <span className="text-parchment">{r.discord_username}</span></>}
                {r.phone_number && <> · {r.phone_number}</>}
                {r.email && <> · {r.email}</>}
              </p>
              <p className="text-xs text-ash/60 mt-3">
                {new Date(r.created_at).toLocaleString()}
                {r.delivered_at && <> · Delivered {new Date(r.delivered_at).toLocaleString()}</>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
