'use client';

import { CrackDivider } from '@/components/ui';
import { CopyButton } from '@/components/CopyButton';
import { Reveal } from '@/components/Reveal';
import { Rays } from '@/components/home/Rays';
import DotField from '@/components/DotField';
import { FocusGrid } from '@/components/FocusGrid';
import type { SiteLink } from '@/lib/queries';

const MODES = [
  { name: 'Survival Mode', copy: 'Build your empire, explore vast landscapes, and survive with other players. Farm resources, craft items, and establish your dominance in the peaceful realm.' },
  { name: 'PvP Mode', copy: 'Engage in intense combat battles. Fight for supremacy in arena-style gameplay with epic rewards and bragging rights.' },
  { name: 'Lifesteal Mode', copy: 'The ultimate hardcore challenge! Every kill heals you, every death costs your experience. Rise or fall on the blood-soaked battlefields.' },
  { name: 'Economy & Trading', copy: 'Build your wealth through trading, businesses, and smart investments. The player-driven economy rewards the shrewd and punishes the greedy.' },
  { name: 'Ranks & Progression', copy: 'Climb through exclusive ranks with unique perks and abilities. Unlock special commands and gain prestige as you progress.' },
  { name: 'Legendary Crates', copy: 'Open rare and legendary crates to obtain exclusive items, weapons, and cosmetics. Roll the dice and find your fortune!' },
];

export function WhyJoin() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <DotField
          dotRadius={1.5}
          dotSpacing={16}
          bulgeStrength={50}
          glowRadius={200}
          gradientFrom="rgba(255,90,46,0.35)"
          gradientTo="rgba(255,164,107,0.15)"
          glowColor="#0B0A0C"
        />
      </div>

      <Reveal>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-parchment">
          Why Join <span className="text-core-ember">DEMONCORE MC</span>
        </h2>
        <p className="text-ash text-center mt-3 max-w-xl mx-auto">
          The best Minecraft SMP experience — epic gameplay, an active community, and endless fun.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {MODES.map((m, i) => (
          <Reveal
            key={m.name}
            delay={i * 0.08}
            className="border border-white/10 bg-void/70 backdrop-blur-sm p-8"
          >
            <span className="font-mono text-xs text-ash">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-display text-lg text-parchment mt-2">{m.name}</h3>
            <p className="text-sm text-ash mt-3 leading-relaxed">{m.copy}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const SEASON_MODES = [
  { name: 'Survival Mode', tags: ['Build & Explore', 'Farming & Crafting', 'Base Building', 'Co-op Gameplay'] },
  { name: 'PvP Mode', tags: ['Combat Arena', 'Ranked Battles', 'Epic Rewards', 'Leaderboards'] },
  { name: 'Lifesteal Mode', tags: ['Hardcore Combat', 'Health Stealing', 'Perma-Death', 'High Risk/Reward'] },
  { name: 'Events Mode', tags: ['Limited-Time Challenges', 'Parkour & Minigames', 'Community Events', 'Exclusive Rewards'] },
];

const NEW_SYSTEMS = [
  { name: 'Economy System', copy: 'Player-driven economy with trading, shops, and business opportunities. Become a merchant or investor.' },
  { name: 'Rank System', copy: 'Progress through ranks to unlock exclusive perks, commands, and abilities. Show off your achievements.' },
  { name: 'Crate System', copy: 'Open rare and legendary crates containing exclusive items, cosmetics, and powerful weapons.' },
];

export function Season2Features() {
  return (
    <section className="border-t border-white/10 bg-obsidian/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-ash text-center max-w-xl mx-auto">
            Four epic game modes with completely new systems, mechanics, and progression paths.
          </p>
        </Reveal>

        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-core-ember mt-16 mb-6">
          Four Game Modes
        </h3>
        <FocusGrid
          gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          borderColor="#FF5A2E"
          glowColor="rgba(255,90,46,0.6)"
        >
          {SEASON_MODES.map((mode, i) => (
            <Reveal key={mode.name} delay={i * 0.08} className="h-full border border-white/10 p-6">
              <h4 className="font-display text-parchment">{mode.name}</h4>
              <ul className="mt-4 space-y-2 text-sm text-ash">
                {mode.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </FocusGrid>

        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-core-ember mt-16 mb-6">
          New Systems
        </h3>
        <FocusGrid
          gridClassName="grid grid-cols-1 md:grid-cols-3 gap-6"
          borderColor="#8A98A6"
          glowColor="rgba(138,152,166,0.6)"
        >
          {NEW_SYSTEMS.map((sys, i) => (
            <Reveal key={sys.name} delay={i * 0.08} className="h-full border border-white/10 p-6">
              <h4 className="font-display text-parchment">{sys.name}</h4>
              <p className="mt-3 text-sm text-ash leading-relaxed">{sys.copy}</p>
            </Reveal>
          ))}
        </FocusGrid>
      </div>
    </section>
  );
}

export function ServerInfo({ discordUrl, addresses: siteAddresses }: { discordUrl: string; addresses: SiteLink[] }) {
  const addresses =
    siteAddresses.length > 0
      ? siteAddresses.map((a) => ({ label: a.label, value: a.url }))
      : [
          { label: 'Java Edition', value: 'play.demoncoremc.fun:25577' },
          { label: 'Bedrock Edition', value: 'play.demoncoremc.fun:19176' },
        ];
  const stats = [
    { label: 'Version', value: '1.21.11' },
    { label: 'Location', value: 'Server India' },
    { label: 'Uptime', value: '24/7' },
    { label: 'Economy', value: 'No P2W' },
  ];

  return (
    <section id="server-info" className="relative mx-auto max-w-4xl px-6 pt-16 pb-24 overflow-hidden">
      <Rays className="-z-10" />

      <Reveal className="relative border border-core-ember/25 p-8 md:p-10">
        <span className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 border-core-ember" />
        <span className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2 border-core-ember" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-core-ember" />
        <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-core-ember" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {addresses.map((addr, i) => (
            <Reveal key={addr.label} delay={i * 0.1}>
              <div className="text-xs uppercase tracking-wide text-ash">{addr.label}</div>
              <div className="mt-2 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="font-mono text-base md:text-lg text-parchment truncate">{addr.value}</span>
                <CopyButton value={addr.value} tooltip={`Copy ${addr.label} address`} />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.2 + i * 0.06} className="border-l-2 border-core-ember pl-3">
              <div className="text-[10px] uppercase tracking-wide text-ash">{s.label}</div>
              <div className="mt-1 font-mono text-sm text-parchment">{s.value}</div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.55} className="mt-10">
          <a
            href={discordUrl}
            target="_blank"
            rel="noreferrer"
            className="cursor-target block text-center bg-core-ember text-void py-3 font-display uppercase tracking-wide hover:bg-core-glow transition-colors"
          >
            Join Our Discord Community
          </a>
        </Reveal>
      </Reveal>
    </section>
  );
}

export function About() {
  const values = [
    { name: 'Fairness', copy: 'We maintain a level playing field for all players.' },
    { name: 'Community', copy: 'We foster a welcoming and supportive community.' },
    { name: 'Excellence', copy: 'We strive to provide the best server experience.' },
    { name: 'Innovation', copy: 'We continuously update and improve our features.' },
  ];

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-24 grid grid-cols-1 lg:grid-cols-5 gap-12">
        <Reveal className="lg:col-span-2 border-l-2 border-core-ember pl-6">
          <p className="text-core-ember font-display uppercase text-sm tracking-wide">
            Season 2: Rise of the Demons
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold text-parchment leading-tight">
            About DEMONCORE MC
          </h2>
          <p className="text-ash mt-6 leading-relaxed">
            A premier Minecraft server dedicated to providing the best multiplayer experience —
            inclusive, fair, and exciting, where players can build, explore, compete, and thrive.
          </p>
        </Reveal>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
          {values.map((v, i) => (
            <Reveal
              key={v.name}
              delay={i * 0.08}
              className="group bg-void p-6 hover:bg-obsidian/60 transition-colors"
            >
              <span className="font-mono text-3xl text-ash/40 group-hover:text-core-ember transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-parchment mt-3">{v.name}</h3>
              <p className="text-sm text-ash mt-1">{v.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JoinCTA({ discordUrl }: { discordUrl: string }) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <CrackDivider />
      <Reveal>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-parchment mt-14">
          Join Our Community
        </h2>
        <p className="text-ash mt-4 max-w-xl mx-auto">
          Ready to become part of DEMONCORE MC? Join thousands of players already enjoying
          epic adventures on our server.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="/#server-info" className="cursor-target bg-core-ember px-7 py-3 font-display uppercase tracking-wide text-void hover:bg-core-glow transition-colors">
            Join Server
          </a>
          <a href={discordUrl} target="_blank" rel="noreferrer" className="cursor-target border border-white/20 px-7 py-3 font-display uppercase tracking-wide text-parchment hover:border-core-ember transition-colors">
            Discord Community
          </a>
        </div>
      </Reveal>
    </section>
  );
}
