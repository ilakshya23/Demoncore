'use client';

import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="cursor-target text-xs uppercase tracking-wide text-ash hover:text-core-ember transition-colors"
    >
      Sign Out
    </button>
  );
}
