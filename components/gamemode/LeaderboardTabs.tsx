'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCachedFetch } from '@/lib/useCachedFetch';
import { Skeleton } from '@/components/ui';

type Entry = { rank: number; player: string; value: number };
type Boards = Record<string, Entry[]>;

const TABS: { key: string; label: string; format: (v: number) => string }[] = [
  { key: 'baltop', label: 'Balance', format: (v) => `$${v.toLocaleString()}` },
  { key: 'top_kills', label: 'Kills', format: (v) => v.toLocaleString() },
  { key: 'top_deaths', label: 'Deaths', format: (v) => v.toLocaleString() },
  { key: 'top_playtime', label: 'Playtime', format: (v) => `${Math.round(v / 60)}h` },
];

export function LeaderboardTabs({ gamemode, accent }: { gamemode: string; accent: string }) {
  const [active, setActive] = useState(TABS[0].key);
  const { data, loading } = useCachedFetch<Boards>(
    `dc_leaderboard_${gamemode}`,
    `/api/leaderboards?gamemode=${gamemode}`,
    60000
  );

  const entries = data?.[active] ?? [];
  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-1.5 text-xs uppercase tracking-wide font-display transition-colors ${
              active === tab.key ? 'text-void' : 'text-ash hover:text-parchment'
            }`}
            style={active === tab.key ? { backgroundColor: accent } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-5"
        >
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-ash py-8 text-center">
              No {activeTab.label.toLowerCase()} data yet — check back once the season gets going.
            </p>
          ) : (
            <ol className="divide-y divide-white/5">
              {entries.map((e) => (
                <li key={e.rank} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-ash w-6">{e.rank}</span>
                    <span className="text-parchment">{e.player}</span>
                  </span>
                  <span className="font-mono" style={{ color: accent }}>
                    {activeTab.format(e.value)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
