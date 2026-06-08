// M4 Weekly Optimizer — QStash job handler.
// Reads last week's GA4 + order data, calls Opus, writes the next-week plan,
// then enqueues script-batch generation for each active track.

import { NextResponse } from "next/server";
import { verifyQStashSignature, enqueueScriptBatch } from "@/lib/qstash";
import { getTracks, getBrandConfig, getGa4SessionsForRange, getOrdersForRange, createWeeklyPlan } from "@/lib/db";
import { runOptimizer } from "@/lib/claude";
import { buildOptimizerPrompt, DEFAULT_BRAND_BRIEF, DEFAULT_HOME_CARE_PROMPT, DEFAULT_TRUCKING_PROMPT } from "@/lib/claude/prompts";
import { addDeadLetter } from "@/lib/db";
import { sendWeeklyReport } from "@/lib/resend";
import { generateWeeklyEmail } from "@/lib/claude";
import { buildWeeklyEmailPrompt } from "@/lib/claude/prompts";
import type { PlanAngle } from "@/lib/types";

export async function POST(req: Request) {
  const valid = await verifyQStashSignature(req);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const tracks = await getTracks();
    const brandConfig = await getBrandConfig();

    const brief = brandConfig?.brief || DEFAULT_BRAND_BRIEF;

    const weekStart = getPreviousSunday();
    const weekEnd = addDays(weekStart, 6);
    const nextWeekStart = addDays(weekStart, 7);

    const trackSystemPrompts: Record<string, string> = {
      home_care: brandConfig?.home_care_system_prompt || DEFAULT_HOME_CARE_PROMPT,
      trucking: brandConfig?.trucking_system_prompt || DEFAULT_TRUCKING_PROMPT,
    };

    const emailTracks: Parameters<typeof buildWeeklyEmailPrompt>[0] = [];

    for (const track of tracks) {
      try {
        const sessions = await getGa4SessionsForRange(weekStart, weekEnd);
        const orders = await getOrdersForRange(weekStart, addDays(weekEnd, 1));

        const trackSessions = sessions.filter((s) => s.utm_track === track.slug);
        const trackOrders = orders.filter((o) => o.utm_track === track.slug);

        // Group by angle (utm_clip → clip_id)
        const clipMap = new Map<string, { sessions: number; orders: number; angle: string }>();
        for (const s of trackSessions) {
          const key = s.utm_clip ?? "unknown";
          const cur = clipMap.get(key) ?? { sessions: 0, orders: 0, angle: key };
          cur.sessions += s.sessions;
          clipMap.set(key, cur);
        }
        for (const o of trackOrders) {
          const key = o.utm_clip ?? "unknown";
          const cur = clipMap.get(key) ?? { sessions: 0, orders: 0, angle: key };
          cur.orders += 1;
          clipMap.set(key, cur);
        }

        const ranked = Array.from(clipMap.values()).sort(
          (a, b) => b.orders * 10 + b.sessions - (a.orders * 10 + a.sessions)
        );
        const topClips = ranked.slice(0, 3);
        const bottomClips = ranked.slice(-3).reverse();

        const trackPrompt = trackSystemPrompts[track.slug] ?? "";
        const optimizerPrompt = buildOptimizerPrompt(track.name, trackPrompt, brief, {
          topClips,
          bottomClips,
          totalSessions: trackSessions.reduce((sum, s) => sum + s.sessions, 0),
          totalOrders: trackOrders.length,
        });

        const result = await runOptimizer(brief, optimizerPrompt);

        const plan = await createWeeklyPlan({
          track_id: track.id,
          week_start: nextWeekStart,
          angles: result.angles as PlanAngle[],
          posting_plan: result.posting_plan,
          status: "active",
        });

        await enqueueScriptBatch(track.id, plan.id);

        emailTracks.push({
          name: track.name,
          sessions: trackSessions.reduce((sum, s) => sum + s.sessions, 0),
          orders: trackOrders.length,
          trend: "steady",
          topAngle: topClips[0]?.angle ?? "n/a",
        });
      } catch (err) {
        await addDeadLetter("optimizer", { track_id: track.id }, String(err));
      }
    }

    // Send the weekly report email
    try {
      const { subject, body_html } = await generateWeeklyEmail(brief, buildWeeklyEmailPrompt(emailTracks));
      await sendWeeklyReport(subject, body_html);
    } catch {
      // Don't fail the whole job if email fails
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    await addDeadLetter("optimizer", {}, String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function getPreviousSunday(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - 7);
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
