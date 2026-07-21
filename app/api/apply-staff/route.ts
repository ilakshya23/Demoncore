import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  inGameName: z.string().min(1).max(50),
  discordTag: z.string().min(1).max(50),
  age: z.number().int().min(10).max(120).optional(),
  position: z.string().min(1).max(50),
  experience: z.string().min(1).max(3000),
  whyYou: z.string().min(1).max(3000),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', issues: parsed.error.issues }, { status: 400 });
  }

  const { inGameName, discordTag, age, position, experience, whyYou } = parsed.data;
  const supabase = supabaseAdmin();

  const { error: dbError } = await supabase.from('staff_applications').insert({
    in_game_name: inGameName,
    discord_tag: discordTag,
    age: age ?? null,
    position,
    experience,
    why_you: whyYou,
  });

  if (dbError) {
    return NextResponse.json({ error: 'Could not save application' }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'DEMONCORE MC <noreply@demoncoremc.fun>',
        to: process.env.CONTACT_TO_EMAIL ?? 'you@demoncoremc.fun',
        subject: `[Staff Application] ${position} — ${inGameName}`,
        text: `IGN: ${inGameName}\nDiscord: ${discordTag}\nAge: ${age ?? 'n/a'}\nPosition: ${position}\n\nExperience:\n${experience}\n\nWhy them:\n${whyYou}`,
      });
    } catch {
      // swallow — application already saved
    }
  }

  return NextResponse.json({ ok: true });
}
