'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// AnimatePresence (exit + enter choreography) proved unreliable across
// consecutive navigations — the exit/enter handoff intermittently got stuck,
// either leaving old pages un-unmounted (DOM accumulation) or leaving new
// pages animated-in at permanent opacity:0 (blank screen, content present in
// DOM but invisible). Next.js already unmounts the old page synchronously on
// navigation, so no exit animation is needed — a plain keyed fade-in has no
// wait-for-exit state to get stuck in.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
