const HEART = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

const DRUMSTICK = [
  [0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 1, 1],
];

function PixelIcon({ bitmap, color, size = 14 }: { bitmap: number[][]; color: string; size?: number }) {
  const cols = bitmap[0].length;
  const rows = bitmap.length;
  return (
    <svg width={size} height={(size * rows) / cols} viewBox={`0 0 ${cols} ${rows}`} shapeRendering="crispEdges">
      {bitmap.map((row, y) =>
        row.map((cell, x) => (cell ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} /> : null))
      )}
    </svg>
  );
}

function ItemImg({ src, alt, size = 24 }: { src: string; alt: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={size} height={size} style={{ imageRendering: 'pixelated' }} />;
}

function Slot({
  children,
  count,
  selected,
}: {
  children?: React.ReactNode;
  count?: number;
  selected?: boolean;
}) {
  return (
    <div
      className={`relative h-9 w-9 md:h-10 md:w-10 border ${selected ? 'border-white' : 'border-black/70'} bg-void flex items-center justify-center overflow-hidden`}
    >
      {children}
      {count !== undefined && (
        <span
          className="absolute bottom-0 right-0.5 font-mono text-[10px] md:text-xs font-bold text-white"
          style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

export function MinecraftHUD() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none select-none bg-void border-t border-white/10 pt-3 pb-3 hidden sm:flex flex-col items-center gap-1">
      <div className="flex items-center gap-4">
        <div className="flex gap-[3px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <PixelIcon key={i} bitmap={HEART} color="#DE2727" size={14} />
          ))}
        </div>
        <div className="flex gap-[3px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <PixelIcon key={i} bitmap={DRUMSTICK} color="#B0703A" size={14} />
          ))}
        </div>
      </div>
      <div className="flex border-2 border-black bg-obsidian p-[3px] gap-[3px]">
        <Slot selected>
          <ItemImg
            src="https://minecraft.wiki/images/Enchanted_Diamond_Sword.gif?f741f"
            alt="Enchanted Diamond Sword"
          />
        </Slot>
        <Slot>
          <ItemImg
            src="https://wiki.cosmicsky.net/images/1/13/Enchanted_Diamond_Pickaxe.gif"
            alt="Enchanted Diamond Pickaxe"
          />
        </Slot>
        <Slot>
          <ItemImg
            src="https://minecraft.wiki/images/Enchanted_Diamond_Axe.gif?9b71e&format=original"
            alt="Enchanted Diamond Axe"
          />
        </Slot>
        <Slot />
        <Slot />
        <Slot />
        <Slot count={16}>
          <ItemImg src="https://minecraft.wiki/images/Ender_Pearl_JE3_BE2.png?829a7&format=original" alt="Ender Pearl" />
        </Slot>
        <Slot count={32}>
          <ItemImg
            src="https://minecraft.wiki/images/Enchanted_Golden_Apple_JE2_BE2.gif?f4719"
            alt="Enchanted Golden Apple"
          />
        </Slot>
        <Slot count={64}>
          <ItemImg src="https://minecraft.wiki/images/Golden_Carrot_JE4_BE2.png?43b25&format=original" alt="Golden Carrot" />
        </Slot>
      </div>
    </div>
  );
}
