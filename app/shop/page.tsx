import { RanksGrid, CrateKeysGrid, CoinsGrid } from '@/components/gamemode/RanksAndCrates';
import { getRanks, getCrateKeys, getCoinPackages } from '@/lib/queries';
import { CrackDivider } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';

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
      coins: await getCoinPackages(mode.key),
    }))
  );

  return (
    <>
      <PageHero
        eyebrow="Support the Server"
        title="Shop"
        subtitle="Every purchase keeps DEMONCORE MC online, ad-free, and zero pay-to-win. Ranks and crate keys are cosmetic and convenience only."
      />
      <CrackDivider />

      {data.map((mode) => (
        <section key={mode.key} className="mx-auto max-w-6xl px-6 py-20 border-t border-white/10 first:border-t-0">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">
              {mode.label} <span style={{ color: mode.accent }}>Ranks</span>
            </h2>
          </Reveal>
          <RanksGrid ranks={mode.ranks} server={mode.key} />

          <Reveal className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl text-parchment mb-8">
              {mode.label} <span style={{ color: mode.accent }}>Crate Keys</span>
            </h2>
          </Reveal>
          <CrateKeysGrid keys={mode.keys} server={mode.key} />

          <Reveal className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl text-parchment">
              {mode.label} <span style={{ color: mode.accent }}>Coins</span>
            </h2>
            <p className="text-ash text-sm mt-2 mb-8">2 INR = 1 Coin</p>
          </Reveal>
          <CoinsGrid coins={mode.coins} server={mode.key} />
        </section>
      ))}
    </>
  );
}
