'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Rank, CrateKey } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { MinecraftText } from '@/components/MinecraftText';
import { PurchaseModal, PurchaseItem } from './PurchaseModal';

function ComingSoon({ label }: { label?: string }) {
  return (
    <div className="border border-dashed border-white/10 py-16 text-center">
      <p className="font-display text-2xl text-parchment uppercase tracking-wide">Coming Soon</p>
      <p className="text-ash text-sm mt-2">{label ?? 'Lifesteal ranks and crate keys are on the way.'}</p>
    </div>
  );
}

// Horizontally draggable track — used for the survival ranks carousel.
function DragCarousel({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);

  useEffect(() => {
    const update = () => {
      if (containerRef.current && trackRef.current) {
        setConstraint(Math.max(0, trackRef.current.scrollWidth - containerRef.current.offsetWidth));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [children]);

  return (
    <div>
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -constraint, right: 0 }}
          dragElastic={0.12}
          className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
        >
          {children}
        </motion.div>
      </div>
      {constraint > 0 && <p className="mt-4 text-center text-xs text-ash">← Drag to see every rank →</p>}
    </div>
  );
}

export function RanksGrid({ ranks, server }: { ranks: Rank[]; server: 'survival' | 'lifesteal' }) {
  const [purchaseItem, setPurchaseItem] = useState<PurchaseItem | null>(null);

  if (server === 'lifesteal') return <ComingSoon />;

  const purchasable = ranks.filter((r) => r.price != null && r.price > 0);
  if (purchasable.length === 0) return <p className="text-ash text-sm">No ranks available yet.</p>;

  return (
    <>
      <DragCarousel>
        {purchasable.map((rank, i) => (
          <Reveal
            key={rank.id}
            delay={i * 0.05}
            className="bg-parchment text-void flex flex-col overflow-hidden w-72 shrink-0"
          >
            <div className="bg-obsidian py-4 flex items-center justify-center pointer-events-none">
              <MinecraftText
                code={rank.color_code}
                fallback={rank.name}
                className="font-display text-lg uppercase tracking-wide text-parchment"
              />
            </div>
            <div className="p-5 flex flex-col flex-1 pointer-events-none">
              {rank.perks.length > 0 && (
                <ul className="space-y-1.5 text-sm text-void/70 flex-1">
                  {rank.perks.map((perk, j) => (
                    <li key={j}>{perk}</li>
                  ))}
                </ul>
              )}
              <div className="mt-4 font-mono text-lg font-bold">₹{rank.price}</div>
              <button
                onClick={() =>
                  setPurchaseItem({ type: 'rank', name: rank.name, server, quantity: 1, amount: rank.price! })
                }
                className="cursor-target pointer-events-auto mt-4 bg-core-ember text-void py-2.5 font-display uppercase tracking-wide text-sm hover:bg-core-glow transition-colors"
              >
                Purchase
              </button>
            </div>
          </Reveal>
        ))}
      </DragCarousel>
      <PurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} />
    </>
  );
}

const KEY_QUANTITIES: { qty: number; discount: number }[] = [
  { qty: 1, discount: 0 },
  { qty: 5, discount: 0.1 },
  { qty: 10, discount: 0.2 },
];

// Avoids float noise like 2.99 * 5 === 14.950000000000001.
function money(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function CrateKeysGrid({ keys, server }: { keys: CrateKey[]; server: 'survival' | 'lifesteal' }) {
  const [purchaseItem, setPurchaseItem] = useState<PurchaseItem | null>(null);

  if (server === 'lifesteal') return <ComingSoon />;

  const purchasable = keys.filter((k) => k.price != null);
  if (purchasable.length === 0) return <p className="text-ash text-sm">No crate keys available yet.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {purchasable.map((key, i) => (
          <Reveal
            key={key.id}
            delay={i * 0.06}
            className="border border-white/10 p-6 flex flex-col items-center text-center"
          >
            {key.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/crates/${key.image}`}
                alt={key.name}
                className="h-20 w-20 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            )}
            <h3 className="font-display text-parchment mt-3">{key.name}</h3>
            {key.contents && <p className="text-xs text-ash mt-2">{key.contents}</p>}
            <div className="mt-4 grid grid-cols-3 gap-2 w-full">
              {KEY_QUANTITIES.map(({ qty, discount }) => {
                const rawTotal = money(key.price! * qty);
                const finalTotal = money(rawTotal * (1 - discount));
                return (
                  <button
                    key={qty}
                    onClick={() =>
                      setPurchaseItem({ type: 'crate_key', name: key.name, server, quantity: qty, amount: finalTotal })
                    }
                    className="cursor-target border border-white/15 py-2 text-xs hover:border-core-ember transition-colors"
                  >
                    <div className="text-parchment">{qty}×</div>
                    {discount > 0 && <div className="text-ash/50 line-through text-[10px] leading-tight">₹{rawTotal}</div>}
                    <div className="font-mono text-core-ember">₹{finalTotal}</div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-ash/70">Save 10% on 5× · 20% on 10×</p>
          </Reveal>
        ))}
      </div>
      <PurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} />
    </>
  );
}
