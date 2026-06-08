// M3 GA4 daily pull — QStash job handler.
import { NextResponse } from "next/server";
import { verifyQStashSignature } from "@/lib/qstash";
import { pullGa4Sessions } from "@/lib/ga4";
import { upsertGa4Sessions, addDeadLetter } from "@/lib/db";
import { parseUtmFromCampaign } from "@/lib/utm";
import { z } from "zod";

const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });

export async function POST(req: Request) {
  const valid = await verifyQStashSignature(req);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { date } = parsed.data;

  try {
    const rows = await pullGa4Sessions(date, date);

    const toUpsert = rows.map((r) => ({
      date: r.date,
      sessions: r.sessions,
      source: r.source,
      medium: r.medium,
      campaign: r.campaign,
      ...parseUtmFromCampaign(r.campaign, r.content, r.term),
    }));

    await upsertGa4Sessions(toUpsert);

    return NextResponse.json({ ok: true, rows_upserted: toUpsert.length });
  } catch (err) {
    await addDeadLetter("ga4_pull", { date }, String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
