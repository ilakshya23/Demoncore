import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, expectedSessionToken, verifyCredentials } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const id = body?.id ?? '';
  const password = body?.password ?? '';

  if (!(await verifyCredentials(id, password))) {
    return NextResponse.json({ error: 'Incorrect ID or password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await expectedSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
