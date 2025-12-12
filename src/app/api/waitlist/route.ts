import { NextResponse } from "next/server";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().trim().email(),
});

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as unknown;
    const { email } = waitlistSchema.parse(body);

    const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "landing",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {}

    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof z.ZodError ? "Invalid email" : "Bad request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
