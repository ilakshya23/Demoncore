import type { Rank, CrateKey } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';

export function RanksGrid({ ranks, accent }: { ranks: Rank[]; accent: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ranks.map((rank, i) => (
        <Reveal key={rank.id} delay={i * 0.08} className="border border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-parchment">{rank.name}</h3>
            {rank.price_label && (
              <span className="font-mono text-sm" style={{ color: accent }}>
                {rank.price_label}
              </span>
            )}
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-ash flex-1">
            {rank.perks.map((perk, i) => (
              <li key={i}>{perk}</li>
            ))}
          </ul>
          <a
            href="/#server-info"
            className="cursor-target mt-5 text-center border border-white/15 py-2 text-xs uppercase tracking-wide text-parchment hover:border-core-ember transition-colors"
          >
            Purchase on Server
          </a>
        </Reveal>
      ))}
    </div>
  );
}

export function CrateKeysGrid({ keys, accent }: { keys: CrateKey[]; accent: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {keys.map((key, i) => (
        <Reveal key={key.id} delay={i * 0.08} className="border border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-parchment">{key.name}</h3>
            {key.price_label && (
              <span className="font-mono text-sm" style={{ color: accent }}>
                {key.price_label}
              </span>
            )}
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-ash flex-1">
            {key.contents.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <a
            href="/#server-info"
            className="cursor-target mt-5 text-center border border-white/15 py-2 text-xs uppercase tracking-wide text-parchment hover:border-core-ember transition-colors"
          >
            Purchase on Server
          </a>
        </Reveal>
      ))}
    </div>
  );
}
