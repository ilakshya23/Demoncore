'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      age: get('age') ? Number(get('age')) : undefined,
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
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-core-ember/40 bg-core-ember/5 p-10 text-center">
            <h3 className="font-display text-xl text-parchment">Application submitted</h3>
            <p className="text-ash text-sm mt-2">We review every application manually — check Discord for updates.</p>
            <button onClick={() => setStatus('idle')} className="cursor-target mt-6 text-xs uppercase tracking-wide text-core-ember hover:text-core-glow">
              Submit another
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <p className="text-sm text-core-ember border border-core-ember/40 px-4 py-3">
                That application didn't reach us — mind trying again?
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="In-Game Name" name="inGameName" required />
              <Field label="Discord Tag" name="discordTag" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Age" name="age" type="number" />
              <div>
                <label htmlFor="position" className="text-xs uppercase tracking-wide text-ash">Position Applying For</label>
                <select id="position" name="position" required className="mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none">
                  <option value="Moderator">Moderator</option>
                  <option value="Builder">Builder</option>
                  <option value="Event Host">Event Host</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>
            <TextArea label="Relevant Experience" name="experience" />
            <TextArea label="Why Should We Pick You?" name="whyYou" />
            <button type="submit" className="cursor-target bg-core-ember text-void px-7 py-3 font-display uppercase tracking-wide hover:bg-core-glow transition-colors">
              Submit Application
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-wide text-ash">{label}</label>
      <input id={name} name={name} type={type} required={required} className="mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none" />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-wide text-ash">{label}</label>
      <textarea id={name} name={name} required rows={5} className="mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none resize-none" />
    </div>
  );
}
