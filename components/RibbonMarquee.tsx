export function RibbonMarquee({ text = 'Coming Soon' }: { text?: string }) {
  const items = Array.from({ length: 10 }, () => text);

  return (
    <div className="w-full overflow-hidden -rotate-2 bg-core-ember py-3 shadow-[0_0_30px_rgba(255,90,46,0.4)]">
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="mx-6 shrink-0 font-display text-sm md:text-base font-black uppercase tracking-widest text-void"
          >
            {t} ★
          </span>
        ))}
      </div>
    </div>
  );
}
