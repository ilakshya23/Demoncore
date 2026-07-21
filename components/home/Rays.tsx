'use client';

import { motion } from 'framer-motion';

export function Rays({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0deg, rgba(255,90,46,0.18) 6deg, transparent 18deg, transparent 100deg, rgba(255,164,107,0.14) 112deg, transparent 128deg, transparent 210deg, rgba(255,90,46,0.16) 222deg, transparent 236deg, transparent 320deg, rgba(255,164,107,0.1) 330deg, transparent 344deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_15%,_#0B0A0C_78%)]" />
    </div>
  );
}
