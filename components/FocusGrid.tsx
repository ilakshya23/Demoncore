'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import './TrueFocus.css';

export function FocusGrid({
  children,
  gridClassName = 'grid grid-cols-1 md:grid-cols-3 gap-6',
  blurAmount = 4,
  borderColor = '#FF5A2E',
  glowColor = 'rgba(255,90,46,0.6)',
}: {
  children: ReactNode[];
  gridClassName?: string;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const focus = (index: number) => {
    const container = containerRef.current;
    const item = itemRefs.current[index];
    if (!container || !item) return;
    const parentRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setRect({
      x: itemRect.left - parentRect.left,
      y: itemRect.top - parentRect.top,
      width: itemRect.width,
      height: itemRect.height,
    });
    setHovered(index);
  };

  return (
    <div ref={containerRef} className={`relative ${gridClassName}`}>
      {children.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          onMouseEnter={() => focus(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            filter: hovered !== null && hovered !== i ? `blur(${blurAmount}px)` : 'none',
            transition: 'filter 0.3s ease',
          }}
        >
          {child}
        </div>
      ))}

      <motion.div
        className="focus-frame"
        animate={{
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          opacity: hovered !== null ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ '--border-color': borderColor, '--glow-color': glowColor } as React.CSSProperties}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
}
