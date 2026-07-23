'use client';

import { useState, FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type PurchaseItem = {
  type: 'rank' | 'crate_key';
  name: string;
  server: 'survival' | 'lifesteal';
  quantity: number;
  amount: number;
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function PurchaseModal({ item, onClose }: { item: PurchaseItem | null; onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle');

  function close() {
    onClose();
    setTimeout(() => setStatus('idle'), 300); // let the close animation finish first
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!item) return;
    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement)?.value;

    setStatus('sending');
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType: item.type,
          itemName: item.name,
          server: item.server,
          quantity: item.quantity,
          amount: item.amount,
          minecraftUsername: get('minecraftUsername'),
          email: get('email'),
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-void/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-white/10 bg-obsidian p-8 relative"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="cursor-target absolute top-4 right-4 text-ash hover:text-parchment text-lg leading-none"
            >
              ✕
            </button>

            {status === 'sent' ? (
              <div className="text-center py-6">
                <h3 className="font-display text-xl text-parchment">Order received</h3>
                <p className="text-ash text-sm mt-2">
                  No payment gateway is live yet — we'll reach out by email to arrange payment
                  and deliver it in-game.
                </p>
                <button onClick={close} className="cursor-target mt-6 text-xs uppercase tracking-wide text-core-ember hover:text-core-glow">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl text-parchment">{item.name}</h3>
                <p className="text-ash text-sm mt-1">
                  {item.quantity > 1 ? `${item.quantity}× · ` : ''}
                  <span className="font-mono text-core-ember">₹{item.amount}</span> on {item.server}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {status === 'error' && (
                    <p className="text-sm text-core-ember border border-core-ember/40 px-4 py-3">
                      That order didn't go through — mind trying again?
                    </p>
                  )}
                  <div>
                    <label htmlFor="minecraftUsername" className="text-xs uppercase tracking-wide text-ash">
                      Minecraft Username
                    </label>
                    <input
                      id="minecraftUsername"
                      name="minecraftUsername"
                      required
                      className="mt-2 w-full bg-void border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-xs uppercase tracking-wide text-ash">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full bg-void border border-white/15 px-4 py-2.5 text-parchment focus:border-core-ember outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="cursor-target w-full bg-core-ember text-void py-3 font-display uppercase tracking-wide hover:bg-core-glow transition-colors disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Submitting…' : 'Submit Order'}
                  </button>
                  <p className="text-xs text-ash/70 text-center">
                    No payment is collected here yet — we'll follow up by email.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
