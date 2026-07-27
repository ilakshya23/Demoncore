'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MinecraftPanel, MinecraftField, MinecraftInput, MinecraftButton } from '@/components/MinecraftForm';

export type CheckoutItem = {
  itemType: 'rank' | 'crate_key' | 'coin_package';
  itemName: string;
  server: 'survival' | 'lifesteal';
  quantity: number;
  amount: number;
};

type Status = 'idle' | 'processing' | 'error';

let razorpayScriptPromise: Promise<void> | null = null;
function loadRazorpayScript() {
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load payment gateway'));
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

export function CheckoutForm({ item, paymentsEnabled }: { item: CheckoutItem; paymentsEnabled: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  function goToSuccess(paid: boolean) {
    const params = new URLSearchParams({
      paid: paid ? '1' : '0',
      name: item.itemName,
      amount: String(item.amount),
    });
    router.push(`/checkout/success?${params.toString()}`);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('processing');
    setError(null);
    const form = e.currentTarget;
    const get = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value;
    const buyerName = get('buyerName');
    const minecraftUsername = get('minecraftUsername');
    const discordUsername = get('discordUsername');
    const phoneNumber = get('phoneNumber');

    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, buyerName, minecraftUsername, discordUsername, phoneNumber }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Could not start checkout');

      if (!body.razorpay) {
        // No payment gateway configured yet — order is saved, staff follow up manually.
        goToSuccess(false);
        return;
      }

      await loadRazorpayScript();
      const rzp = new (window as any).Razorpay({
        key: body.razorpay.keyId,
        amount: body.razorpay.amount,
        currency: body.razorpay.currency,
        order_id: body.razorpay.orderId,
        name: 'DEMONCORE MC',
        description: item.itemName,
        prefill: { name: buyerName, contact: phoneNumber },
        theme: { color: '#FF5A2E' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                purchaseId: body.purchaseId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error();
            goToSuccess(true);
          } catch {
            setError('Payment went through but we could not confirm it — contact us on Discord with your payment ID.');
            setStatus('error');
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || 'Something went wrong — mind trying again?');
      setStatus('error');
    }
  }

  return (
    <MinecraftPanel className="relative">
      <div className="mb-6 border-b-2 border-black/15 pb-4">
        <h3 className="font-display text-lg text-black">{item.itemName}</h3>
        <p className="text-black/60 text-sm mt-1">
          {item.quantity > 1 ? `${item.quantity}× · ` : ''}
          <span className="font-mono font-bold">₹{item.amount}</span> on {item.server}
        </p>
      </div>

      <p className="mb-5 text-sm text-amber-900 bg-amber-900/10 border-2 border-amber-900/30 px-4 py-3">
        Make sure you're online on the server before paying — delivery happens in-game
        immediately, and it can glitch if you're offline.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status === 'error' && (
          <p className="text-sm text-red-900 bg-red-900/10 border-2 border-red-900/40 px-4 py-3">{error}</p>
        )}
        <MinecraftField label="Full Name">
          <MinecraftInput id="buyerName" name="buyerName" required />
        </MinecraftField>
        <MinecraftField label="In-Game Name">
          <MinecraftInput id="minecraftUsername" name="minecraftUsername" required />
        </MinecraftField>
        <MinecraftField label="Discord Username">
          <MinecraftInput id="discordUsername" name="discordUsername" required />
        </MinecraftField>
        <MinecraftField label="Phone Number">
          <MinecraftInput id="phoneNumber" name="phoneNumber" type="tel" required />
        </MinecraftField>
        <MinecraftButton type="submit" disabled={status === 'processing'} className="w-full">
          {status === 'processing' ? 'Processing…' : paymentsEnabled ? `Pay ₹${item.amount}` : 'Submit Order'}
        </MinecraftButton>
      </form>
    </MinecraftPanel>
  );
}
