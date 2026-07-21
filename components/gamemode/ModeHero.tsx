'use client';

import { motion } from 'framer-motion';
import { CrackDivider } from '@/components/ui';
import { PlayersOnline } from './PlayersOnline';

export function ModeHero({
  title,
  tagline,
  accent,
  serverKey,
}: {
  title: string;
  tagline: string;
  accent: string;
  serverKey: string;
}) {
  return (
    <section className="relative">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at top, ${accent}22, transparent 60%)` }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-5xl px-6 pt-20 pb-14 text-center"
      >
        <h1 className="font-display text-4xl md:text-6xl font-black uppercase text-parchment">
          {title}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-ash">{tagline}</p>
        <div className="mt-8 flex justify-center">
          <PlayersOnline serverKey={serverKey} label={title} />
        </div>
      </motion.div>
      <CrackDivider />
    </section>
  );
}
