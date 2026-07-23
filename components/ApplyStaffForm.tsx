'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MinecraftPanel, MinecraftField, MinecraftInput, MinecraftTextarea, MinecraftSelect, MinecraftButton } from './MinecraftForm';

type Status = 'idle' | 'sent' | 'error';

export function ApplyStaffForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement)?.value;

    const data = {
      inGameName: get('inGameName'),
      discordTag: get('discordTag'),
      age: Number(get('age')),
      position: get('position'),
      experience: get('experience'),
      whyYou: get('whyYou'),
    };

    setStatus('sent');
    form.reset();

    try {
      const res = await fetch('/api/apply-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <MinecraftPanel className="relative">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <h3 className="font-display text-xl text-black">Application submitted</h3>
            <p className="text-black/60 text-sm mt-2">We review every application manually — check Discord for updates.</p>
            <button
              onClick={() => setStatus('idle')}
              className="cursor-target mt-6 text-xs uppercase tracking-wide text-black underline hover:no-underline"
            >
              Submit another
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <p className="text-sm text-red-900 bg-red-900/10 border-2 border-red-900/40 px-4 py-3">
                That application didn't reach us — mind trying again?
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MinecraftField label="In-Game Name">
                <MinecraftInput id="inGameName" name="inGameName" required />
              </MinecraftField>
              <MinecraftField label="Discord Tag">
                <MinecraftInput id="discordTag" name="discordTag" required />
              </MinecraftField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MinecraftField label="Age">
                <MinecraftInput id="age" name="age" type="number" required />
              </MinecraftField>
              <MinecraftField label="Position Applying For">
                <MinecraftSelect id="position" name="position" required>
                  <option value="Helper">Helper</option>
                  <option value="Media">Media</option>
                  <option value="Mod">Mod</option>
                  <option value="Developer">Developer</option>
                  <option value="Admin">Admin</option>
                </MinecraftSelect>
              </MinecraftField>
            </div>
            <MinecraftField label="Relevant Experience">
              <MinecraftTextarea id="experience" name="experience" required rows={5} />
            </MinecraftField>
            <MinecraftField label="Why Should We Pick You?">
              <MinecraftTextarea id="whyYou" name="whyYou" required rows={5} />
            </MinecraftField>
            <MinecraftButton type="submit">Submit Application</MinecraftButton>
          </motion.form>
        )}
      </AnimatePresence>
    </MinecraftPanel>
  );
}
