import Link from 'next/link';
import { Logo } from './Logo';
import { CrackDivider } from './ui';

export function Footer() {
  return (
    <footer className="relative z-10 mt-24">
      <CrackDivider />
      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-ash max-w-xs">
            Season 2: Rise of the Demons. Survival, PvP, and Lifesteal on an India-based,
            zero pay-to-win SMP.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ash mb-4">Server</h3>
          <ul className="space-y-2 text-sm">
            <li className="text-parchment">Java: <span className="font-mono text-core-glow">play.demoncoremc.fun:25577</span></li>
            <li className="text-parchment">Bedrock: <span className="font-mono text-core-glow">play.demoncoremc.fun:19176</span></li>
            <li className="text-ash">1.21.11 &middot; 🇮🇳 India &middot; 24/7</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ash mb-4">Navigate</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="text-ash hover:text-parchment">Shop</Link></li>
            <li><Link href="/events" className="text-ash hover:text-parchment">Events</Link></li>
            <li><Link href="/rules" className="text-ash hover:text-parchment">Rules</Link></li>
            <li><Link href="/staff" className="text-ash hover:text-parchment">Staff</Link></li>
            <li><Link href="/apply-staff" className="text-ash hover:text-parchment">Apply for Staff</Link></li>
            <li><Link href="/contact" className="text-ash hover:text-parchment">Contact Us</Link></li>
            <li><Link href="/admin" className="text-ash hover:text-parchment">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ash mb-4">Community</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://discord.gg/P6agT4xbAm" target="_blank" rel="noreferrer" className="text-ash hover:text-parchment">
                Discord
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 sm:pb-28 text-center text-xs text-ash space-y-1.5">
        <div>
          © {new Date().getFullYear()} DEMONCORE MC. Not affiliated with Mojang or Microsoft.
        </div>
        <div>
          <a
            href="https://sketchfab.com/3d-models/minecraft-warden-91b73626b9524ec7a2012e555709944e"
            target="_blank"
            rel="noreferrer"
            className="hover:text-parchment"
          >
            &quot;Minecraft Warden&quot;
          </a>
          {' '}3D model by BeckBroEYTube, licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-parchment"
          >
            CC BY 4.0
          </a>
        </div>
      </div>
    </footer>
  );
}
