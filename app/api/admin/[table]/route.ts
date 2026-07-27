import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, isValidSessionCookie } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

// Every table the admin panel is allowed to touch. Anything not listed here
// is rejected — this is the one place that decides what's editable at all.
const ALLOWED_TABLES = new Set([
  'ranks',
  'crate_keys',
  'coin_packages',
  'staff_members',
  'media_creators',
  'rules',
  'site_links',
  'current_event',
  'contact_submissions',
  'staff_applications',
  'purchase_requests',
]);

async function requireAdmin() {
  return isValidSessionCookie(cookies().get(ADMIN_COOKIE)?.value);
}

function checkTable(table: string) {
  return ALLOWED_TABLES.has(table);
}

export async function GET(req: NextRequest, { params }: { params: { table: string } }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!checkTable(params.table)) return NextResponse.json({ error: 'Unknown table' }, { status: 404 });

  const { data, error } = await supabaseAdmin().from(params.table).select('*').order('sort_order', { ascending: true, nullsFirst: true });
  if (error) {
    // Some tables (submissions, current_event) have no sort_order — fall back to unordered select.
    const retry = await supabaseAdmin().from(params.table).select('*');
    if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
    return NextResponse.json(retry.data);
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: { table: string } }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!checkTable(params.table)) return NextResponse.json({ error: 'Unknown table' }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { data, error } = await supabaseAdmin().from(params.table).insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { table: string } }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!checkTable(params.table)) return NextResponse.json({ error: 'Unknown table' }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body || !body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { id, ...updates } = body;

  const { data, error } = await supabaseAdmin().from(params.table).update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { table: string } }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!checkTable(params.table)) return NextResponse.json({ error: 'Unknown table' }, { status: 404 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabaseAdmin().from(params.table).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
