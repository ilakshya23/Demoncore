'use client';

import { useCachedFetch } from '@/lib/useCachedFetch';
import { StatCard } from '@/components/ui';

type Stats = {
  playersOnline: number;
  uptime: string;
  version: string;
};

export function LiveStats() {
  const { data, loading } = useCachedFetch<Stats>('dc_stats', '/api/stats', 15000);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Players Online" value={data?.playersOnline ?? 0} loading={loading} />
        <StatCard label="Uptime" value={data?.uptime ?? '24/7'} loading={loading} />
        <StatCard label="Version" value={data?.version ?? '1.21.11'} loading={loading} />
      </div>
    </section>
  );
}
