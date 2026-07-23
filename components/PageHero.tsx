'use client';

import { motion } from 'framer-motion';
import { LampContainer } from '@/components/ui/lamp';

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <LampContainer>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeInOut' }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-core-ember"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        initial={{ opacity: 0.5, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
        className="mt-4 font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-parchment text-center"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeInOut' }}
          className="mt-4 max-w-xl mx-auto text-ash text-center"
        >
          {subtitle}
        </motion.p>
      )}
    </LampContainer>
  );
}
