// M3 Stan Store order webhook — forwarded by Zapier.
// Verifies the shared secret, extracts UTMs, writes to stan_orders.

import { NextResponse } from "next/server";
import { upsertStanOrder, getTrackBySlug } from "@/lib/db";
import { z } from "zod";

const SECRET = () => process.env.STAN_WEBHOOK_SECRET ?? "";

const schema = z.object({
  order_id: z.string(),
  product_id: z.string(),
  amount: z.number().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
});

export async function POST(req: Request) {
  const secret = req.headers.get("x-stan-secret");
  if (!secret || secret !== SECRET()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const d = parsed.data;
  const raw = body as Record<string, unknown>;

  // Resolve track_id from utm_campaign which matches track slug
  let track_id: number | null = null;
  if (d.utm_campaign) {
    const track = await getTrackBySlug(d.utm_campaign);
    track_id = track?.id ?? null;
  }

  await upsertStanOrder({
    order_id: d.order_id,
    product_id: d.product_id,
    track_id,
    amount_cents: Math.round((d.amount ?? 0) * 100),
    utm_track: d.utm_campaign ?? null,
    utm_clip: d.utm_content ?? null,
    utm_account: d.utm_term ?? null,
    raw,
    received_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
