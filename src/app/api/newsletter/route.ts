import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.email().max(254) });
export async function POST(request: NextRequest) {
  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const limit = await checkRateLimit(`newsletter:${identifier}`);
  if (!limit.success) return NextResponse.json({ error: "Please wait a minute before trying again." }, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("newsletter_subscribers").upsert({ email: parsed.data.email, status: "active", source: "website" }, { onConflict: "email" });
    if (error) throw error;
    if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) { const resend = new Resend(process.env.RESEND_API_KEY); await resend.emails.send({ from: process.env.EMAIL_FROM, to: parsed.data.email, subject: "Welcome to Allinonehub", html: "<p>Welcome to Allinonehub. We’ll send thoughtful opportunities and useful resources when they matter.</p>" }); }
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Subscriptions are being set up. Please try again shortly." }, { status: 503 }); }
}
