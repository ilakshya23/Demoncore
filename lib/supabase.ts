import { createClient } from '@supabase/supabase-js';

// Browser/public client — safe to expose, respects Row Level Security.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
