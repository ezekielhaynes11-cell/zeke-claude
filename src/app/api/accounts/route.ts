import { NextResponse } from "next/server";
import { getAllAccounts, sql } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  const accounts = await getAllAccounts();
  return NextResponse.json(accounts);
}

const upsertSchema = z.object({
  platform: z.enum(["tiktok", "instagram", "youtube"]),
  profile_id: z.string().min(1),
  profile_name: z.string().min(1),
  daily_cap: z.number().int().min(1).max(10).default(3),
});

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const d = parsed.data;
  await sql`
    INSERT INTO social_accounts (platform, profile_id, profile_name, daily_cap)
    VALUES (${d.platform}, ${d.profile_id}, ${d.profile_name}, ${d.daily_cap})
    ON CONFLICT (profile_id) DO UPDATE SET
      profile_name = EXCLUDED.profile_name,
      daily_cap = EXCLUDED.daily_cap,
      status = 'connected',
      last_disconnect_reason = NULL
  `;
  return NextResponse.json({ ok: true });
}
