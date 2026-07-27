'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, animate } from 'framer-motion';
import type { Rank, CrateKey, CoinPackage } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { MinecraftText } from '@/components/MinecraftText';
import type { CheckoutItem } from '@/components/CheckoutForm';

function ComingSoon({ label }: { label?: string }) {
  return (
    <div className="border border-dashed border-white/10 py-16 text-center">
      <p className="font-display text-2xl text-parchment uppercase tracking-wide">Coming Soon</p>
      <p className="text-ash text-sm mt-2">{label ?? 'Lifesteal ranks and crate keys are on the way.'}</p>
    </div>
  );
}

// Every "Purchase"/"Buy" button sends the shopper to /checkout with the item
// encoded in the query string — the checkout page rebuilds it server-side
// rather than trusting anything from client state.
function useCheckout() {
  const router = useRouter();
  return (item: CheckoutItem) => {
    const params = new URLSearchParams({
      type: item.itemType,
      name: item.itemName,
      server: item.server,
      quantity: String(item.quantity),
      amount: String(item.amount),
    });
    router.push(`/checkout?${params.toString()}`);
  };
}

// Horizontally draggable track — used for the survival ranks/coins carousels.
function DragCarousel({ children, hint = 'Drag to see every rank' }: { children: React.ReactNode; hint?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);
  const x = useMotionValue(0);

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

  function scrollBy(direction: 1 | -1) {
    const step = (containerRef.current?.offsetWidth ?? 300) * 0.8;
    const next = Math.min(0, Math.max(-constraint, x.get() - direction * step));
    animate(x, next, { type: 'spring', stiffness: 300, damping: 40 });
  }

  return (
    <div>
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -constraint, right: 0 }}
          dragElastic={0.12}
          className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
        >
          {children}
        </motion.div>
      </div>
      {constraint > 0 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="cursor-target border border-white/15 hover:border-core-ember px-3 py-1.5 text-parchment transition-colors"
          >
            ←
          </button>
          <p className="text-xs text-ash">{hint}</p>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="cursor-target border border-white/15 hover:border-core-ember px-3 py-1.5 text-parchment transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export function RanksGrid({ ranks, server }: { ranks: Rank[]; server: 'survival' | 'lifesteal' }) {
  const goToCheckout = useCheckout();

  if (server === 'lifesteal') return <ComingSoon />;

  const purchasable = ranks.filter((r) => r.price != null && r.price > 0);
  if (purchasable.length === 0) return <p className="text-ash text-sm">No ranks available yet.</p>;

  return (
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
              onClick={() => goToCheckout({ itemType: 'rank', itemName: rank.name, server, quantity: 1, amount: rank.price! })}
              className="cursor-target pointer-events-auto mt-4 bg-core-ember text-void py-2.5 font-display uppercase tracking-wide text-sm hover:bg-core-glow transition-colors"
            >
              Purchase
            </button>
          </div>
        </Reveal>
      ))}
    </DragCarousel>
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
  const goToCheckout = useCheckout();

  if (server === 'lifesteal') return <ComingSoon />;

  const purchasable = keys.filter((k) => k.price != null);
  if (purchasable.length === 0) return <p className="text-ash text-sm">No crate keys available yet.</p>;

  return (
    <DragCarousel hint="Drag to see every key">
      {purchasable.map((key, i) => (
        <Reveal
          key={key.id}
          delay={i * 0.06}
          className="border border-white/10 p-6 flex flex-col items-center text-center w-64 shrink-0"
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
                    goToCheckout({ itemType: 'crate_key', itemName: key.name, server, quantity: qty, amount: finalTotal })
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
    </DragCarousel>
  );
}

export function CoinsGrid({ coins, server }: { coins: CoinPackage[]; server: 'survival' | 'lifesteal' }) {
  const goToCheckout = useCheckout();

  if (server === 'lifesteal') return <ComingSoon label="Lifesteal coins are on the way." />;

  const purchasable = coins.filter((c) => c.coins > 0);
  if (purchasable.length === 0) return <p className="text-ash text-sm">No coin packages available yet.</p>;

  return (
    <DragCarousel hint="Drag to see every package">
      {purchasable.map((pack, i) => {
        // 10% off packages above 250 coins.
        const discounted = pack.coins > 250;
        const finalPrice = discounted ? money(pack.price * 0.9) : pack.price;

        return (
          <Reveal
            key={pack.id}
            delay={i * 0.05}
            className="relative bg-parchment text-void flex flex-col items-center overflow-hidden w-56 shrink-0 p-6 text-center"
          >
            {discounted && (
              <div className="absolute top-0 right-0 bg-core-ember text-void text-[10px] font-bold uppercase tracking-wide px-2.5 py-1">
                10% Off
              </div>
            )}
            <div className="font-display text-3xl font-black">{pack.coins}</div>
            <div className="text-xs uppercase tracking-wide text-void/60 mt-1">Coins</div>
            <div className="mt-4">
              {discounted && <span className="text-void/50 line-through text-sm mr-2">₹{pack.price}</span>}
              <span className="font-mono text-lg font-bold">₹{finalPrice}</span>
            </div>
            <button
              onClick={() =>
                goToCheckout({ itemType: 'coin_package', itemName: `${pack.coins} Coins`, server, quantity: 1, amount: finalPrice })
              }
              className="cursor-target mt-4 w-full bg-core-ember text-void py-2.5 font-display uppercase tracking-wide text-sm hover:bg-core-glow transition-colors"
            >
              Purchase
            </button>
          </Reveal>
        );
      })}
    </DragCarousel>
  );
}
