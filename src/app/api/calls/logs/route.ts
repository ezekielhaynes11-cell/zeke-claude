import { NextRequest, NextResponse } from "next/server";
import { getCallLogs } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId") ?? undefined;
  const logs = await getCallLogs(contactId);
  return NextResponse.json(logs);
}
