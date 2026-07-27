import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  itemType: z.enum(['rank', 'crate_key', 'coin_package']),
  itemName: z.string().min(1).max(100),
  server: z.enum(['survival', 'lifesteal']),
  quantity: z.number().int().min(1).max(10),
  amount: z.number().min(1),
  buyerName: z.string().min(1).max(100),
  minecraftUsername: z.string().min(1).max(50),
  discordUsername: z.string().min(1).max(50),
  phoneNumber: z.string().min(6).max(20),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', issues: parsed.error.issues }, { status: 400 });
  }
  const { itemType, itemName, server, quantity, amount, buyerName, minecraftUsername, discordUsername, phoneNumber } =
    parsed.data;

  const supabase = supabaseAdmin();
  const { data: purchase, error: dbError } = await supabase
    .from('purchase_requests')
    .insert({
      item_type: itemType,
      item_name: itemName,
      server,
      quantity,
      amount,
      buyer_name: buyerName,
      minecraft_username: minecraftUsername,
      discord_username: discordUsername,
      phone_number: phoneNumber,
    })
    .select()
    .single();

  if (dbError || !purchase) {
    return NextResponse.json({ error: dbError?.message || 'Could not save purchase request' }, { status: 500 });
  }

  // No Razorpay keys configured — the checkout page falls back to a plain
  // "submit order, we'll follow up" flow with no payment step.
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ purchaseId: purchase.id, razorpay: null });
  }

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: purchase.id,
      notes: { itemName, buyerName, minecraftUsername, discordUsername, phoneNumber },
    });

    await supabase.from('purchase_requests').update({ razorpay_order_id: order.id }).eq('id', purchase.id);

    return NextResponse.json({
      purchaseId: purchase.id,
      razorpay: { orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Could not create payment order' }, { status: 500 });
  }
}
