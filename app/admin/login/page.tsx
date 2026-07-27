'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ParallaxImage } from '@/components/ParallaxImage';
import { MinecraftPanel, MinecraftField, MinecraftInput, MinecraftButton } from '@/components/MinecraftForm';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const id = (form.elements.namedItem('id') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    setLoading(false);

    if (!res.ok) {
      setError('Incorrect ID or password.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="relative isolate min-h-[80vh] flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ParallaxImage src="/backgrounds/contact-bg.jpg" />
        <div className="absolute inset-0 bg-void/75" />
      </div>

      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <MinecraftPanel>
          <h1 className="font-display text-lg text-center text-black uppercase tracking-wide mb-6">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-900 bg-red-900/10 border-2 border-red-900/40 px-4 py-3">{error}</p>
            )}
            <MinecraftField label="Admin ID">
              <MinecraftInput id="id" name="id" type="text" required />
            </MinecraftField>
            <MinecraftField label="Password">
              <div className="relative">
                <MinecraftInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="cursor-target absolute right-0 top-0 bottom-0 px-3 text-xs uppercase tracking-wide text-ash hover:text-parchment"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </MinecraftField>
            <MinecraftButton type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </MinecraftButton>
          </form>
        </MinecraftPanel>
      </div>
    </div>
  );
}
