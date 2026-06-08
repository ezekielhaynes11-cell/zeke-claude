// M1 Script batch generation — QStash job handler.
// Reads the weekly plan, calls Sonnet to produce scripts, writes to Postgres.

import { NextResponse } from "next/server";
import { verifyQStashSignature } from "@/lib/qstash";
import {
  getBrandConfig,
  getLatestPlanForTrack,
  createScriptBatch,
  createScript,
  addDeadLetter,
} from "@/lib/db";
import { getTrackBySlug, getTracks } from "@/lib/db";
import { generateScriptBatch } from "@/lib/claude";
import {
  buildScriptBatchPrompt,
  DEFAULT_BRAND_BRIEF,
  DEFAULT_HOME_CARE_PROMPT,
  DEFAULT_TRUCKING_PROMPT,
} from "@/lib/claude/prompts";
import { z } from "zod";

const schema = z.object({
  track_id: z.number(),
  weekly_plan_id: z.number().optional(),
});

export async function POST(req: Request) {
  const valid = await verifyQStashSignature(req);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { track_id, weekly_plan_id } = parsed.data;

  try {
    const brandConfig = await getBrandConfig();
    const brief = brandConfig?.brief || DEFAULT_BRAND_BRIEF;

    const tracks = await getTracks();
    const track = tracks.find((t) => t.id === track_id);
    if (!track) throw new Error(`Track ${track_id} not found`);

    const trackSystemPrompts: Record<string, string> = {
      home_care: brandConfig?.home_care_system_prompt || DEFAULT_HOME_CARE_PROMPT,
      trucking: brandConfig?.trucking_system_prompt || DEFAULT_TRUCKING_PROMPT,
    };
    const trackPrompt = trackSystemPrompts[track.slug] ?? "";

    const plan = weekly_plan_id
      ? await getLatestPlanForTrack(track_id)
      : await getLatestPlanForTrack(track_id);

    const angles = (plan?.angles ?? []).map((a) =>
      typeof a === "object" && "hook" in a ? `${a.hook} — ${a.angle}` : String(a)
    );

    const systemPrompt = `${brief}\n\n${trackPrompt}`;
    const userPrompt = buildScriptBatchPrompt(trackPrompt, brief, angles, 5);

    const scripts = await generateScriptBatch(systemPrompt, userPrompt);

    const batchId = await createScriptBatch(track_id, weekly_plan_id ?? null);

    for (const s of scripts) {
      await createScript({
        batch_id: batchId,
        track_id,
        hook: s.hook,
        angle: s.angle,
        body: s.body,
      });
    }

    return NextResponse.json({ ok: true, batch_id: batchId, script_count: scripts.length });
  } catch (err) {
    await addDeadLetter("script_batch", { track_id, weekly_plan_id }, String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
