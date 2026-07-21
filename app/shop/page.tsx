import { RanksGrid, CrateKeysGrid } from '@/components/gamemode/RanksAndCrates';
import { getRanks, getCrateKeys } from '@/lib/queries';
import { CrackDivider } from '@/components/ui';
import { Reveal } from '@/components/Reveal';

export const metadata = { title: 'Shop — DEMONCORE MC' };

const GAMEMODES: { key: 'survival' | 'lifesteal'; label: string; accent: string }[] = [
  { key: 'survival', label: 'Survival', accent: '#4C9A6A' },
  { key: 'lifesteal', label: 'Lifesteal', accent: '#C81E3A' },
];

export default async function ShopPage() {
  const data = await Promise.all(
    GAMEMODES.map(async (mode) => ({
      ...mode,
      ranks: await getRanks(mode.key),
      keys: await getCrateKeys(mode.key),
    }))
  );

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-14 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-core-ember">Support the Server</p>
        <h1 className="mt-4 font-display text-4xl md:text-6xl font-black uppercase text-parchment">
          Shop
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-ash">
          Every purchase keeps DEMONCORE MC online, ad-free, and zero pay-to-win. Ranks and
          crate keys are cosmetic and convenience only.
        </p>
      </section>
      <CrackDivider />

      {data.map((mode) => (
        <section key={mode.key} className="mx-auto max-w-6xl px-6 py-20 border-t border-white/10 first:border-t-0">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">
              {mode.label} <span style={{ color: mode.accent }}>Ranks</span>
            </h2>
          </Reveal>
          <RanksGrid ranks={mode.ranks} accent={mode.accent} />

          <Reveal className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">
              {mode.label} <span style={{ color: mode.accent }}>Crate Keys</span>
            </h2>
          </Reveal>
          <CrateKeysGrid keys={mode.keys} accent={mode.accent} />
        </section>
      ))}
    </>
  );
}
