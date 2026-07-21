import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const entrySchema = z.object({
  rank: z.number().int().positive(),
  playerName: z.string().min(1),
  playerUuid: z.string().optional(),
  value: z.number(),
});

const payloadSchema = z.object({
  gamemode: z.enum(['survival', 'pvp', 'lifesteal']),
  category: z.enum(['baltop', 'top_kills', 'top_deaths', 'top_playtime']),
  entries: z.array(entrySchema).max(50),
});

/**
 * Called by each gamemode's Paper plugin on an interval (default 5 min —
 * these boards don't need to be real-time). Replaces the full top-N list
 * for that (gamemode, category) pair in one call.
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

  const { gamemode, category, entries } = parsed.data;
  const supabase = supabaseAdmin();

  const rows = entries.map((e) => ({
    gamemode,
    category,
    rank: e.rank,
    player_name: e.playerName,
    player_uuid: e.playerUuid ?? null,
    value: e.value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('leaderboards')
    .upsert(rows, { onConflict: 'gamemode,category,rank' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
