'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import CursorGrid from '@/components/CursorGrid';

export function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B0A0C,#141215_45%,#0B0A0C)]" />
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 left-[8%] h-[520px] w-[520px] rounded-full bg-core-ember/10 blur-[130px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[55%] right-[4%] h-[420px] w-[420px] rounded-full bg-core-emberDim/10 blur-[110px]"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[115%] left-[28%] h-[380px] w-[380px] rounded-full bg-core-glow/5 blur-[110px]"
      />
      <div className="absolute inset-0 pointer-events-auto">
        <CursorGrid
          cellSize={56}
          color="#FF5A2E"
          radius={160}
          falloff="smooth"
          holdTime={120}
          fadeDuration={600}
          lineWidth={1}
          maxOpacity={0.55}
          fillOpacity={0.03}
          gridOpacity={0.025}
          clickPulse
          pulseSpeed={900}
        />
      </div>
    </div>
  );
}
