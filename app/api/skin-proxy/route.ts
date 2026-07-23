import { NextRequest, NextResponse } from 'next/server';
import dns from 'node:dns/promises';
import net from 'node:net';

// Many skin sites (minecraftskins.com included) don't send CORS headers, so
// the browser refuses to read the pixels back out for a WebGL texture —
// skinview3d's load silently fails and we fall back to Steve. Fetching the
// image server-side and re-serving it from our own origin sidesteps that
// entirely. Since this fetches an arbitrary caller-supplied URL, it's a
// textbook SSRF surface — resolve the host first and refuse private/internal
// IP ranges before ever making the request.
function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254);
  }
  const lower = ip.toLowerCase();
  return lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80');
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get('url');
  if (!target) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
  }

  try {
    const { address } = await dns.lookup(parsed.hostname);
    if (isPrivateIp(address)) return NextResponse.json({ error: 'Blocked host' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Could not resolve host' }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), { signal: AbortSignal.timeout(10000) });
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 });
  }
  if (!upstream.ok) return NextResponse.json({ error: 'Upstream error' }, { status: 502 });

  const contentType = upstream.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) return NextResponse.json({ error: 'Not an image' }, { status: 415 });

  const buf = await upstream.arrayBuffer();
  if (buf.byteLength > 5 * 1024 * 1024) return NextResponse.json({ error: 'Too large' }, { status: 413 });

  return new NextResponse(buf, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
