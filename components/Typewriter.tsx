'use client';

import { useEffect, useRef, useState } from 'react';

export function Typewriter({
  lines,
  className = '',
  speed = 45,
  startDelay = 0,
}: {
  lines: { text: string; className?: string }[];
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const fullLength = lines.reduce((sum, l) => sum + l.text.length, 0);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTimer = setTimeout(() => {
            let i = 0;
            const id = setInterval(() => {
              i++;
              setCount(i);
              if (i >= fullLength) clearInterval(id);
            }, speed);
          }, startDelay);
          return () => clearTimeout(startTimer);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = count >= fullLength;

  let remaining = count;
  const visibleLines: { text: string; className?: string; take: number }[] = [];
  for (const line of lines) {
    const take = Math.max(0, Math.min(line.text.length, remaining));
    visibleLines.push({ ...line, take });
    remaining -= line.text.length;
    if (take < line.text.length) break;
  }

  return (
    <span ref={ref} className={className} aria-label={lines.map((l) => l.text).join(' ')}>
      {visibleLines.map((line, i) => (
        <span key={i}>
          <span className={line.className}>{line.text.slice(0, line.take)}</span>
          {i < visibleLines.length - 1 && <br />}
        </span>
      ))}
      <span className={`inline-block w-[0.5ch] ${done ? 'animate-emberPulse' : 'opacity-100'}`}>▌</span>
    </span>
  );
}
