'use client';

import { useEffect, useState } from 'react';

/**
 * Stale-while-revalidate fetch hook.
 * - Reads any cached value from localStorage immediately (instant paint, no
 *   skeleton flash on repeat visits).
 * - Always kicks off a background revalidation fetch.
 * - Persists the fresh value back to localStorage.
 *
 * This is safe to use for public, non-sensitive data only (player counts,
 * leaderboards, rank/crate catalogues) — never for anything auth-scoped.
 */
export function useCachedFetch<T>(key: string, url: string, refreshMs = 30000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
      }
    } catch {
      /* ignore corrupt cache */
    }

    async function load() {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        setData(json);
        setError(null);
        try {
          localStorage.setItem(key, JSON.stringify(json));
        } catch {
          /* storage full/unavailable — non-fatal */
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = window.setInterval(load, refreshMs);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [key, url, refreshMs]);

  return { data, loading: loading && !data, error };
}
