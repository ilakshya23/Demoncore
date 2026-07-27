import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({ id: z.string().uuid() });

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-plugin-key');
  if (!key || key !== process.env.PLUGIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from('purchase_requests')
    .update({ delivered_at: new Date().toISOString(), status: 'completed' })
    .eq('id', parsed.data.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
