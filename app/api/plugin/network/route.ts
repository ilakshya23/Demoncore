import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const payloadSchema = z.object({
  totalOnline: z.number().int().nonnegative(),
  servers: z.record(z.number().int().nonnegative()), // e.g. { survival: 42, pvp: 12, lifesteal: 8 }
});

/**
 * Called by the Velocity plugin (DemonCoreNetworkBridge) on an interval.
 * Auth: shared secret in the `x-plugin-key` header, set as PLUGIN_API_KEY
 * in both Vercel env vars and the plugin's config.yml. This is not
 * user-facing auth — see the admin panel auth (Phase 3) for that.
 */
export async function POST(req: NextRequest) {
  const key = req.headers.get('x-plugin-key');
  if (!key || key !== process.env.PLUGIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from('server_stats').upsert({
    id: 'global',
    players_online: parsed.data.totalOnline,
    per_server: parsed.data.servers,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
