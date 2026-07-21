import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(150).optional(),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  const { name, email, subject, message } = parsed.data;
  const supabase = supabaseAdmin();

  const { error: dbError } = await supabase.from('contact_submissions').insert({
    name,
    email,
    subject: subject ?? null,
    message,
  });

  if (dbError) {
    return NextResponse.json({ error: 'Could not save submission' }, { status: 500 });
  }

  // Email is best-effort: if Resend fails, the submission is still saved and
  // visible in the admin panel, so we don't fail the whole request over it.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'DEMONCORE MC <noreply@demoncoremc.fun>',
        to: process.env.CONTACT_TO_EMAIL ?? 'you@demoncoremc.fun',
        replyTo: email,
        subject: `[Contact] ${subject || 'New message'} — from ${name}`,
        text: message,
      });
    } catch {
      // swallow — submission already saved
    }
  }

  return NextResponse.json({ ok: true });
}
