import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  itemType: z.enum(['rank', 'crate_key']),
  itemName: z.string().min(1).max(100),
  server: z.enum(['survival', 'lifesteal']),
  quantity: z.number().int().min(1).max(10),
  amount: z.number().min(0),
  minecraftUsername: z.string().min(1).max(50),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', issues: parsed.error.issues }, { status: 400 });
  }

  const { itemType, itemName, server, quantity, amount, minecraftUsername, email } = parsed.data;
  const supabase = supabaseAdmin();

  const { error: dbError } = await supabase.from('purchase_requests').insert({
    item_type: itemType,
    item_name: itemName,
    server,
    quantity,
    amount,
    minecraft_username: minecraftUsername,
    email,
  });

  if (dbError) {
    return NextResponse.json({ error: 'Could not save purchase request' }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'DEMONCORE MC <noreply@demoncoremc.fun>',
        to: process.env.CONTACT_TO_EMAIL ?? 'you@demoncoremc.fun',
        reply_to: email,
        subject: `[Purchase] ${itemName}${quantity > 1 ? ` x${quantity}` : ''} — ₹${amount} — ${minecraftUsername}`,
        text: `IGN: ${minecraftUsername}\nEmail: ${email}\nServer: ${server}\nItem: ${itemName}\nQuantity: ${quantity}\nAmount: ₹${amount}\n\nNo payment gateway yet — contact the player to complete payment.`,
      });
    } catch {
      // swallow — request already saved
    }
  }

  return NextResponse.json({ ok: true });
}
