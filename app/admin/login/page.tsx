'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabasePublic } from '@/lib/supabase';
import { Logo } from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const { error } = await supabasePublic.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError('Incorrect email or password.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-white/10 p-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h1 className="font-display text-lg text-center text-parchment uppercase tracking-wide">
          Admin Panel
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p className="text-sm text-core-ember border border-core-ember/40 px-4 py-2.5">{error}</p>}
          <div>
            <label htmlFor="email" className="text-xs uppercase tracking-wide text-ash">Email</label>
            <input id="email" name="email" type="email" required className="cursor-target mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="text-xs uppercase tracking-wide text-ash">Password</label>
            <input id="password" name="password" type="password" required className="cursor-target mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-target w-full bg-core-ember text-void py-2.5 font-display uppercase tracking-wide hover:bg-core-glow transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
