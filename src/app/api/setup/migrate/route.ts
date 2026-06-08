import { NextResponse } from "next/server";
import { runMigrations } from "@/lib/db/migrate";

export async function POST(req: Request) {
  // Require a setup secret to prevent abuse
  const auth = req.headers.get("x-setup-secret");
  if (!auth || auth !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await runMigrations();
  return NextResponse.json({ ok: true });
}
