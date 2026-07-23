import Link from 'next/link';
import { Logo } from './Logo';
import { CrackDivider } from './ui';
import { getDiscordUrl } from '@/lib/queries';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

export async function Footer() {
  const discordUrl = await getDiscordUrl();
  return (
    <footer className="relative z-10 mt-24">
      <CrackDivider />
      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link href="/" className="cursor-target inline-block"><Logo /></Link>
          <p className="mt-4 text-sm text-ash max-w-xs">
            Season 2: Rise of the Demons. Survival, PvP, and Lifesteal on an India-based,
            zero pay-to-win SMP.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ash mb-4">Navigate</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="cursor-target text-ash hover:text-parchment">Shop</Link></li>
            <li><Link href="/events" className="cursor-target text-ash hover:text-parchment">Events</Link></li>
            <li><Link href="/rules" className="cursor-target text-ash hover:text-parchment">Rules</Link></li>
            <li><Link href="/staff" className="cursor-target text-ash hover:text-parchment">Staff</Link></li>
            <li><Link href="/contact" className="cursor-target text-ash hover:text-parchment">Contact Us</Link></li>
            <li><Link href="/admin" className="cursor-target text-ash hover:text-parchment">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ash mb-4">Community</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={discordUrl} target="_blank" rel="noreferrer" aria-label="Discord" className="cursor-target inline-flex text-ash hover:text-parchment">
                <DiscordIcon className="h-5 w-5" />
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
            className="cursor-target hover:text-parchment"
          >
            &quot;Minecraft Warden&quot;
          </a>
          {' '}3D model by BeckBroEYTube, licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
            className="cursor-target hover:text-parchment"
          >
            CC BY 4.0
          </a>
        </div>
      </div>
    </footer>
  );
}
