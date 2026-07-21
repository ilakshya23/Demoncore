'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-core-ember/40 bg-core-ember/5 p-10 text-center"
          >
            <h3 className="font-display text-xl text-parchment">Message sent</h3>
            <p className="text-ash text-sm mt-2">
              We'll get back to you by email as soon as we can.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="cursor-target mt-6 text-xs uppercase tracking-wide text-core-ember hover:text-core-glow"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {status === 'error' && (
              <p className="text-sm text-core-ember border border-core-ember/40 px-4 py-3">
                That message didn't reach us — mind trying again?
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="text-xs uppercase tracking-wide text-ash">Name</label>
                <input id="name" name="name" required className="mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none" />
              </div>
              <div>
                <label htmlFor="email" className="text-xs uppercase tracking-wide text-ash">Email</label>
                <input id="email" name="email" type="email" required className="mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="text-xs uppercase tracking-wide text-ash">Subject</label>
              <input id="subject" name="subject" className="mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none" />
            </div>
            <div>
              <label htmlFor="message" className="text-xs uppercase tracking-wide text-ash">Message</label>
              <textarea id="message" name="message" required rows={6} className="mt-2 w-full bg-obsidian border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none resize-none" />
            </div>
            <button type="submit" className="cursor-target bg-core-ember text-void px-7 py-3 font-display uppercase tracking-wide hover:bg-core-glow transition-colors">
              Send Message
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
