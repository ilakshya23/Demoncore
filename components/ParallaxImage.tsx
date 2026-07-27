'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

// A background image that drifts opposite the page's scroll — the classic
// parallax read. Scoped to its own scroll progress (not the whole document)
// so it still looks right no matter where this section sits on the page.
export function ParallaxImage({ src }: { src: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <motion.div style={{ y }} className="absolute inset-0 -top-[10%] -bottom-[10%]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover scale-110 blur-sm" />
    </motion.div>
  );
}
