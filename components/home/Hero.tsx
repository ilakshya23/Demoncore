'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CrackDivider } from '@/components/ui';
import { WardenCharacter } from '@/components/home/WardenCharacter';
import CircularText from '@/components/CircularText';
import { Typewriter } from '@/components/Typewriter';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero({ discordUrl }: { discordUrl: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] });
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section ref={rootRef} className="relative overflow-hidden min-h-[88vh] flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,90,46,0.12),_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="hidden lg:flex absolute top-6 right-8 h-32 w-32 items-center justify-center"
      >
        <CircularText
          text="DEMONCORE * SEASON 2 * "
          spinDuration={16}
          onHover="speedUp"
          className="!h-32 !w-32"
        />
        <span className="absolute h-2.5 w-2.5 rounded-full bg-core-ember shadow-[0_0_12px_rgba(255,90,46,0.8)]" />
      </motion.div>

      <div className="relative flex-1 mx-auto w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 items-end gap-8 pt-24 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ opacity: contentOpacity, y: contentY }}
          className="text-left"
        >
          <motion.p variants={item} className="font-mono text-xs uppercase tracking-[0.3em] text-core-ember">
            Season 2 Live Now
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-parchment"
          >
            <Typewriter
              lines={[{ text: 'Rise of the' }, { text: 'Demons', className: 'text-core-ember' }]}
              speed={90}
            />
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-lg text-ash text-lg">
            Four epic game modes: Survival, PvP, Lifesteal, and Events. Grind for ranks, open rare
            crates, dominate the economy, and become a legend on DEMONCORE MC.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="cursor-target bg-core-ember px-7 py-3 font-display uppercase tracking-wide text-void hover:bg-core-glow transition-colors"
            >
              Join Discord
            </a>
            <a
              href="#server-info"
              className="cursor-target border border-white/20 px-7 py-3 font-display uppercase tracking-wide text-parchment hover:border-core-ember transition-colors"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-10 font-mono text-xs text-ash">
            v1.21.11 &middot; Server India &middot; 24/7 Online
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block relative h-[420px] lg:h-[520px]"
        >
          <WardenCharacter className="!absolute inset-0 h-full w-full" />
        </motion.div>
      </div>

      <CrackDivider />
    </section>
  );
}
