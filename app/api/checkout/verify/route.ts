import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { z } from 'zod';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  purchaseId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  const { purchaseId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 500 });
  }

  // The only proof a payment is real: Razorpay signs order_id|payment_id with
  // our key secret, and we recompute the same HMAC here to check it matches.
  const expected = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: purchase, error } = await supabase
    .from('purchase_requests')
    .update({ status: 'paid', razorpay_payment_id })
    .eq('id', purchaseId)
    .eq('razorpay_order_id', razorpay_order_id)
    .select()
    .single();

  if (error || !purchase) {
    return NextResponse.json({ error: 'Could not record payment' }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'DEMONCORE MC <noreply@demoncoremc.fun>',
        to: process.env.CONTACT_TO_EMAIL ?? 'you@demoncoremc.fun',
        subject: `[Paid] ${purchase.item_name}${purchase.quantity > 1 ? ` x${purchase.quantity}` : ''} — ₹${purchase.amount} — ${purchase.minecraft_username}`,
        text: `IGN: ${purchase.minecraft_username}\nDiscord: ${purchase.discord_username}\nServer: ${purchase.server}\nItem: ${purchase.item_name}\nQuantity: ${purchase.quantity}\nAmount: ₹${purchase.amount}\nRazorpay payment: ${razorpay_payment_id}\n\nPayment confirmed — deliver in-game.`,
      });
    } catch {
      // swallow — payment already recorded, delivery can still happen manually
    }
  }

  return NextResponse.json({ ok: true });
}
