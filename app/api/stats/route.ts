import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 0;

export async function GET() {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from('server_stats')
    .select('*')
    .eq('id', 'global')
    .single();

  if (error || !data) {
    // Graceful fallback so the homepage never breaks if the plugin hasn't
    // reported in yet (e.g. fresh deploy before the Velocity plugin is wired up).
    return NextResponse.json({
      playersOnline: 0,
      perServer: {},
      uptime: '24/7',
      version: '1.21.11',
      discordOnline: 0,
      discordTotal: 0,
    });
  }

  return NextResponse.json({
    playersOnline: data.players_online,
    perServer: data.per_server ?? {},
    uptime: data.uptime_label,
    version: data.version,
    discordOnline: data.discord_online,
    discordTotal: data.discord_total,
  });
}
