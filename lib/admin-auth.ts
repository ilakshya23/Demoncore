// Single-admin auth: one id/password pair lives in env vars (.env.local),
// not a database. The session cookie is just a hash of those env values, so
// it's stateless (no session table) and auto-invalidates whenever the env
// vars change. Uses Web Crypto (available in both the Edge middleware
// runtime and Node route handlers) instead of node:crypto for that reason.
export const ADMIN_COOKIE = 'demoncore_admin_session';

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function expectedSessionToken(): Promise<string> {
  const id = process.env.ADMIN_ID ?? '';
  const password = process.env.ADMIN_PASSWORD ?? '';
  return sha256Hex(`${id}:${password}`);
}

export async function verifyCredentials(id: string, password: string): Promise<boolean> {
  return id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD;
}

export async function isValidSessionCookie(cookieValue: string | undefined | null): Promise<boolean> {
  if (!cookieValue) return false;
  return cookieValue === (await expectedSessionToken());
}
