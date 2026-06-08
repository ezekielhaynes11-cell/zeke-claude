import { NextResponse } from "next/server";
import { getOpenDeadLetters } from "@/lib/db";

export async function GET() {
  const items = await getOpenDeadLetters();
  return NextResponse.json(items);
}
