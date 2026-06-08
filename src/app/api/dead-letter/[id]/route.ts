import { NextResponse } from "next/server";
import { resolveDeadLetter } from "@/lib/db";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const itemId = parseInt(id, 10);
  if (isNaN(itemId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await resolveDeadLetter(itemId);
  return NextResponse.json({ ok: true });
}
