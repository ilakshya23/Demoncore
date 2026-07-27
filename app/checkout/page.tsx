import { redirect } from 'next/navigation';
import { Reveal } from '@/components/Reveal';
import { ParallaxImage } from '@/components/ParallaxImage';
import { CheckoutForm, CheckoutItem } from '@/components/CheckoutForm';

export const metadata = { title: 'Checkout — DEMONCORE MC' };

function parseItem(searchParams: { [key: string]: string | string[] | undefined }): CheckoutItem | null {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const itemType = get('type');
  const itemName = get('name');
  const server = get('server');
  const quantity = Number(get('quantity') ?? '1');
  const amount = Number(get('amount'));

  if (
    (itemType !== 'rank' && itemType !== 'crate_key' && itemType !== 'coin_package') ||
    !itemName ||
    (server !== 'survival' && server !== 'lifesteal') ||
    !Number.isFinite(quantity) ||
    quantity < 1 ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return null;
  }

  return { itemType, itemName, server, quantity, amount };
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const item = parseItem(searchParams);
  if (!item) redirect('/shop');

  const paymentsEnabled = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  return (
    <div className="relative isolate min-h-[80vh]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ParallaxImage src="/backgrounds/contact-bg.jpg" />
        <div className="absolute inset-0 bg-void/75" />
      </div>

      <section className="mx-auto max-w-2xl px-6 py-20">
        <Reveal>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-parchment text-center">
            Checkout
          </h1>
          <p className="text-ash text-center mt-3">Almost there — a few details and you're set.</p>
        </Reveal>
        <Reveal delay={0.12} className="mt-12">
          <CheckoutForm item={item} paymentsEnabled={paymentsEnabled} />
        </Reveal>
      </section>
    </div>
  );
}
