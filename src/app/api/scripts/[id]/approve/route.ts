import { NextResponse } from "next/server";
import { approveBatch, rejectBatch } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batchId = parseInt(id, 10);
  if (isNaN(batchId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
  }

  const session = await getSession();
  const approvedBy = session?.username ?? "operator";

  if (parsed.data.action === "approve") {
    await approveBatch(batchId, approvedBy);
  } else {
    await rejectBatch(batchId);
  }

  return NextResponse.json({ ok: true });
}
