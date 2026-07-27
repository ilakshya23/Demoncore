import { getDiscordUrl } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { ParallaxImage } from '@/components/ParallaxImage';
import { MinecraftPanel } from '@/components/MinecraftForm';

export const metadata = { title: 'Order Received — DEMONCORE MC' };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const paid = get('paid') === '1';
  const itemName = get('name');
  const amount = get('amount');
  const discordUrl = await getDiscordUrl();

  return (
    <div className="relative isolate min-h-[80vh] flex items-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ParallaxImage src="/backgrounds/contact-bg.jpg" />
        <div className="absolute inset-0 bg-void/75" />
      </div>

      <section className="mx-auto max-w-2xl px-6 py-20 w-full">
        <Reveal>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-parchment text-center">
            {paid ? 'Payment Received' : 'Order Received'}
          </h1>
        </Reveal>
        <Reveal delay={0.12} className="mt-12">
          <MinecraftPanel className="text-center py-8">
            {itemName && (
              <p className="text-black/70 text-sm mb-1">
                {itemName}
                {amount && <> — <span className="font-mono font-bold">₹{amount}</span></>}
              </p>
            )}
            <p className="text-black/60 text-sm mt-3 max-w-sm mx-auto">
              {paid
                ? "Your payment is confirmed — if you were online, your order should already be in-game. If it isn't, hop on Discord and let us know."
                : "No payment gateway is live yet — we'll reach out on Discord to arrange payment and deliver your order in-game."}
            </p>
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="cursor-target mt-6 inline-block bg-core-ember text-void px-6 py-2.5 font-display uppercase tracking-wide hover:bg-core-glow transition-colors"
            >
              Join Our Discord
            </a>
          </MinecraftPanel>
        </Reveal>
      </section>
    </div>
  );
}
