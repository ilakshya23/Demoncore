'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MinecraftPanel, MinecraftField, MinecraftInput, MinecraftTextarea, MinecraftButton } from './MinecraftForm';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    // Optimistic: this form works essentially every time it validates, so
    // flip to "sent" immediately rather than showing a spinner and making
    // the person wait on the network round trip.
    setStatus('sent');
    form.reset();

    try {
      const res = await fetch('/api/contact', {
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
            <h3 className="font-display text-xl text-black">Message sent</h3>
            <p className="text-black/60 text-sm mt-2">We'll get back to you by email as soon as we can.</p>
            <button
              onClick={() => setStatus('idle')}
              className="cursor-target mt-6 text-xs uppercase tracking-wide text-black underline hover:no-underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <p className="text-sm text-red-900 bg-red-900/10 border-2 border-red-900/40 px-4 py-3">
                That message didn't reach us — mind trying again?
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MinecraftField label="Name">
                <MinecraftInput id="name" name="name" required />
              </MinecraftField>
              <MinecraftField label="Email">
                <MinecraftInput id="email" name="email" type="email" required />
              </MinecraftField>
            </div>
            <MinecraftField label="Subject">
              <MinecraftInput id="subject" name="subject" required />
            </MinecraftField>
            <MinecraftField label="Message">
              <MinecraftTextarea id="message" name="message" required rows={6} />
            </MinecraftField>
            <MinecraftButton type="submit">Send Message</MinecraftButton>
          </motion.form>
        )}
      </AnimatePresence>
    </MinecraftPanel>
  );
}
