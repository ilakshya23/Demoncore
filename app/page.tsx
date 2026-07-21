import { Hero } from '@/components/home/Hero';
import { LiveStats } from '@/components/home/LiveStats';
import { ParallaxBackground } from '@/components/home/ParallaxBackground';
import { WhyJoin, Season2Features, ServerInfo, About, JoinCTA } from '@/components/home/Sections';
import ScrollVelocity from '@/components/ScrollVelocity';

export default function HomePage() {
  return (
    <div className="relative">
      <ParallaxBackground />
      <div className="relative z-10">
        <Hero />
        <div className="mb-12 border-y border-white/10 py-8 overflow-hidden bg-obsidian/40">
          <ScrollVelocity
            texts={[
              <span key="a" className="text-core-ember">
                DEMONCORE MC &bull; SEASON 2 &bull; RISE OF THE DEMONS &bull;
              </span>,
              <span key="b" className="text-parchment/25">
                SURVIVAL &bull; PVP &bull; LIFESTEAL &bull; EVENTS &bull;
              </span>,
            ]}
            velocity={50}
            numCopies={4}
            className="font-display uppercase font-black text-3xl md:text-5xl mx-6 my-1.5"
          />
        </div>
        <ServerInfo />
        <LiveStats />
        <WhyJoin />
        <Season2Features />
        <About />
        <JoinCTA />
      </div>
    </div>
  );
}
