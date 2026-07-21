'use client';

import { useCachedFetch } from '@/lib/useCachedFetch';
import { Skeleton } from '@/components/ui';

type Stats = { perServer: Record<string, number> };

export function PlayersOnline({ serverKey, label }: { serverKey: string; label: string }) {
  const { data, loading } = useCachedFetch<Stats>('dc_stats', '/api/stats', 15000);
  const count = data?.perServer?.[serverKey];

  return (
    <div className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 font-mono text-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-emberPulse rounded-full bg-core-ember opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-core-ember" />
      </span>
      {loading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        <span className="text-parchment">
          {count ?? 0} playing {label} now
        </span>
      )}
    </div>
  );
}
