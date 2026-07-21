import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 0;

const VALID_MODES = ['survival', 'pvp', 'lifesteal'];
const VALID_CATEGORIES = ['baltop', 'top_kills', 'top_deaths', 'top_playtime'];

export async function GET(req: NextRequest) {
  const gamemode = req.nextUrl.searchParams.get('gamemode');
  if (!gamemode || !VALID_MODES.includes(gamemode)) {
    return NextResponse.json({ error: 'Invalid or missing gamemode' }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from('leaderboards')
    .select('*')
    .eq('gamemode', gamemode)
    .order('rank', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group into { baltop: [...], top_kills: [...], top_deaths: [...], top_playtime: [...] }
  const grouped: Record<string, unknown[]> = Object.fromEntries(VALID_CATEGORIES.map((c) => [c, []]));
  for (const row of data ?? []) {
    if (grouped[row.category]) {
      grouped[row.category].push({
        rank: row.rank,
        player: row.player_name,
        value: row.value,
      });
    }
  }

  return NextResponse.json(grouped);
}
