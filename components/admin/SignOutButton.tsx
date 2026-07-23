'use client';

import { useRouter } from 'next/navigation';
import { supabasePublic } from '@/lib/supabase';

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await supabasePublic.auth.signOut();
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
