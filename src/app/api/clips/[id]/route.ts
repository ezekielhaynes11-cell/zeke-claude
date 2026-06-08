import { NextResponse } from "next/server";
import { getClip } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clipId = parseInt(id, 10);
  if (isNaN(clipId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const clip = await getClip(clipId);
  if (!clip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(clip);
}
