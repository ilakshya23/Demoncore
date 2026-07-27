import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Polled by the gamemode delivery plugin (see gamemode-plugin/) every few
 * seconds. Auth: shared secret in `x-plugin-key`, same PLUGIN_API_KEY used by
 * the Velocity network bridge. Returns only orders whose item has a
 * `command_template` set in the admin panel — anything without one is left
 * for staff to fulfill manually from Admin → Purchase Requests.
 */

type Item = { command_template: string | null };

function resolveCommand(template: string | null, vars: Record<string, string>): string | null {
  if (!template) return null;
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-plugin-key');
  if (!key || key !== process.env.PLUGIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const server = req.nextUrl.searchParams.get('server');
  if (server !== 'survival' && server !== 'lifesteal') {
    return NextResponse.json({ error: 'server must be survival or lifesteal' }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: orders, error } = await supabase
    .from('purchase_requests')
    .select('*')
    .eq('status', 'paid')
    .eq('server', server)
    .is('delivered_at', null)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!orders || orders.length === 0) return NextResponse.json({ deliveries: [] });

  const deliveries = [];
  for (const order of orders) {
    let item: Item | null = null;

    if (order.item_type === 'rank') {
      const { data } = await supabase
        .from('ranks')
        .select('command_template')
        .eq('server', server)
        .eq('name', order.item_name)
        .maybeSingle();
      item = data;
    } else if (order.item_type === 'crate_key') {
      const { data } = await supabase
        .from('crate_keys')
        .select('command_template')
        .eq('server', server)
        .eq('name', order.item_name)
        .maybeSingle();
      item = data;
    } else if (order.item_type === 'coin_package') {
      const coins = parseInt(order.item_name, 10) || 0;
      const { data } = await supabase
        .from('coin_packages')
        .select('command_template')
        .eq('server', server)
        .eq('coins', coins)
        .maybeSingle();
      item = data;
    }

    const coins = order.item_type === 'coin_package' ? String(parseInt(order.item_name, 10) || 0) : String(order.quantity);
    const command = resolveCommand(item?.command_template ?? null, {
      player: order.minecraft_username,
      quantity: String(order.quantity),
      amount: String(order.amount),
      server,
      coins,
    });

    if (command) {
      deliveries.push({
        id: order.id,
        command,
        minecraftUsername: order.minecraft_username,
        itemName: order.item_name,
        quantity: order.quantity,
      });
    }
  }

  return NextResponse.json({ deliveries });
}
