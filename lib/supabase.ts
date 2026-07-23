import { createClient } from '@supabase/supabase-js';

// Browser/public client — safe to expose, respects Row Level Security.
// Next.js patches the global fetch() to cache indefinitely by default; without
// opting out here, admin panel edits (ranks, crates, staff, rules, ...) would
// never show up on the live site until a redeploy. `no-store` fixed that but
// meant every navigation paid a full Supabase round-trip, which is what was
// making page transitions feel slow. A short revalidation window gets both:
// admin edits land within ~20s, and most navigations hit a warm cache.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { fetch: (url, options) => fetch(url, { ...options, next: { revalidate: 20 } }) } }
);

// Server-only client with the service role key — NEVER import this file
// from a 'use client' component. Used only inside app/api/** route handlers
// for admin writes (plugin ingest, admin panel CRUD).
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
