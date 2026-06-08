// Weekly cron: enqueue the optimizer job and return immediately.
import { NextResponse } from "next/server";
import { enqueueOptimizer } from "@/lib/qstash";

export async function GET() {
  // Vercel cron calls this endpoint; we just enqueue and return.
  await enqueueOptimizer();
  return NextResponse.json({ ok: true });
}

// Also allow POST so it can be triggered manually via the dashboard.
export const POST = GET;
