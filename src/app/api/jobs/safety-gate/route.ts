// M2 Brand safety gate — QStash job handler.
// Haiku classifies the clip's script body. Passed clips move to publish.

import { NextResponse } from "next/server";
import { verifyQStashSignature, enqueuePublish } from "@/lib/qstash";
import { getClip, updateClipStatus, addDeadLetter, sql } from "@/lib/db";
import { checkBrandSafety } from "@/lib/claude";
import { buildSafetyPrompt, DEFAULT_BRAND_BRIEF } from "@/lib/claude/prompts";
import { getBrandConfig } from "@/lib/db";
import { z } from "zod";

const schema = z.object({ clip_id: z.number() });

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

  const { clip_id } = parsed.data;

  const clip = await getClip(clip_id);
  if (!clip) return NextResponse.json({ error: "Clip not found" }, { status: 404 });

  if (!["captioned", "safety_checking"].includes(clip.status)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await updateClipStatus(clip_id, "safety_checking");

    // Get the script body for this clip
    let scriptBody = "";
    if (clip.script_id) {
      const { rows } = await sql`SELECT body FROM scripts WHERE id = ${clip.script_id}`;
      scriptBody = rows[0]?.body as string ?? "";
    }

    const brandConfig = await getBrandConfig();
    const brief = brandConfig?.brief || DEFAULT_BRAND_BRIEF;

    const safetyResult = await checkBrandSafety(brief, buildSafetyPrompt(scriptBody));

    if (safetyResult.passed) {
      await updateClipStatus(clip_id, "approved", { safety_result: safetyResult });
      await enqueuePublish(clip_id);
    } else {
      await updateClipStatus(clip_id, "blocked", { safety_result: safetyResult });
      await addDeadLetter("safety_gate_blocked", { clip_id, reason: safetyResult.reason }, safetyResult.reason);
    }

    return NextResponse.json({ ok: true, passed: safetyResult.passed });
  } catch (err) {
    await updateClipStatus(clip_id, "failed", { error_msg: String(err) });
    await addDeadLetter("safety_gate", { clip_id }, String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
