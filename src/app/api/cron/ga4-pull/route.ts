// Daily cron: enqueue GA4 pull for yesterday's data.
import { NextResponse } from "next/server";
import { enqueueGa4Pull } from "@/lib/qstash";

export async function GET() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = yesterday.toISOString().slice(0, 10);
  await enqueueGa4Pull(date);
  return NextResponse.json({ ok: true, date });
}

export const POST = GET;
