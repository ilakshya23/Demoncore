'use client';

import { useEffect, useState } from 'react';
import { setSelectedIcon } from './hudSelection';

const HEALTHBAR_SRC = '/hud/healthbar-hardcore.webp';
const HUNGER_ICON_SRC = '/hud/hunger.webp';

function ItemImg({ src, alt, size = 24 }: { src: string; alt: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={size} height={size} style={{ imageRendering: 'pixelated' }} />;
}

function Slot({
  children,
  count,
  selected,
  onClick,
}: {
  children?: React.ReactNode;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative h-9 w-9 md:h-10 md:w-10 flex items-center justify-center overflow-visible cursor-pointer pointer-events-auto hover:brightness-125"
      style={{
        background: '#8B8B8B',
        borderTop: '2px solid rgba(255,255,255,0.55)',
        borderLeft: '2px solid rgba(255,255,255,0.55)',
        borderBottom: '2px solid rgba(0,0,0,0.55)',
        borderRight: '2px solid rgba(0,0,0,0.55)',
      }}
    >
      <div className="h-full w-full flex items-center justify-center overflow-hidden">{children}</div>
      {count !== undefined && (
        <span
          className="absolute bottom-0 right-0.5 font-mono text-[10px] md:text-xs font-bold text-white"
          style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
        >
          {count}
        </span>
      )}
      {selected && (
        <div
          className="absolute -inset-[3px] pointer-events-none"
          style={{
            border: '2px solid #FFFFFF',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.8)',
          }}
        />
      )}
    </div>
  );
}

const ITEMS: { src?: string; alt?: string; count?: number }[] = [
  { src: 'https://minecraft.wiki/images/Enchanted_Diamond_Sword.gif?f741f', alt: 'Enchanted Diamond Sword' },
  { src: 'https://wiki.cosmicsky.net/images/1/13/Enchanted_Diamond_Pickaxe.gif', alt: 'Enchanted Diamond Pickaxe' },
  { src: 'https://minecraft.wiki/images/Enchanted_Diamond_Axe.gif?9b71e&format=original', alt: 'Enchanted Diamond Axe' },
  {},
  {},
  {},
  { src: 'https://minecraft.wiki/images/Ender_Pearl_JE3_BE2.png?829a7&format=original', alt: 'Ender Pearl', count: 16 },
  { src: 'https://minecraft.wiki/images/Enchanted_Golden_Apple_JE2_BE2.gif?f4719', alt: 'Enchanted Golden Apple', count: 32 },
  { src: 'https://minecraft.wiki/images/Golden_Carrot_JE4_BE2.png?43b25&format=original', alt: 'Golden Carrot', count: 64 },
];

const STORAGE_KEY = 'demoncore-hud-selected-slot';

export function MinecraftHUD() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return;
    const stored = Number(raw);
    if (Number.isInteger(stored) && stored >= 0 && stored < ITEMS.length) setSelected(stored);
  }, []);

  useEffect(() => {
    setSelectedIcon(selected !== null ? ITEMS[selected]?.src ?? null : null);
  }, [selected]);

  const select = (i: number) => {
    setSelected(i);
    localStorage.setItem(STORAGE_KEY, String(i));
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 select-none pointer-events-none bg-void border-t border-white/10 pt-3 pb-3 hidden sm:flex flex-col items-center gap-1">
      <div className="flex items-center gap-4 pointer-events-none">
        <img src={HEALTHBAR_SRC} alt="Health" style={{ imageRendering: 'pixelated', height: 16, width: 'auto' }} />
        <div className="flex gap-[3px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <ItemImg key={i} src={HUNGER_ICON_SRC} alt="Hunger" size={16} />
          ))}
        </div>
      </div>
      <div className="flex border-2 border-black bg-obsidian p-[3px] gap-[3px] pointer-events-auto">
        {ITEMS.map((item, i) => (
          <Slot key={i} count={item.count} selected={selected === i} onClick={() => select(i)}>
            {item.src && <ItemImg src={item.src} alt={item.alt!} />}
          </Slot>
        ))}
      </div>
    </div>
  );
}
