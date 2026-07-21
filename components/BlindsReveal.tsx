'use client';

import { motion } from 'framer-motion';

export function BlindsReveal({
  children,
  strips = 8,
  className = '',
}: {
  children: React.ReactNode;
  strips?: number;
  className?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      <div className="absolute inset-0 flex" aria-hidden>
        {Array.from({ length: strips }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-void origin-top"
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.76, 0, 0.24, 1] }}
          />
        ))}
      </div>
    </div>
  );
}
