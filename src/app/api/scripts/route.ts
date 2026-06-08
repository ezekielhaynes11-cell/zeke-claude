import { NextResponse } from "next/server";
import { getPendingBatches } from "@/lib/db";

export async function GET() {
  const batches = await getPendingBatches();
  return NextResponse.json(batches);
}
