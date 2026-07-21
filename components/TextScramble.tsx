'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&';

export function TextScramble({
  text,
  className = '',
  duration = 900,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          scramble();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scramble() {
    const start = performance.now();
    function frame(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(progress * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          out += ' ';
        } else {
          out += i < revealCount ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(out);
      if (progress < 1) requestAnimationFrame(frame);
      else setDisplay(text);
    }
    requestAnimationFrame(frame);
  }

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
}
