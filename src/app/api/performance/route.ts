import { NextResponse } from "next/server";
import { getTracks, getGa4SessionsForRange, getOrdersForRange } from "@/lib/db";
import type { TrackPerformance } from "@/lib/types";

export async function GET() {
  const tracks = await getTracks();

  const now = new Date();
  const thisWeekStart = getWeekStart(now, 0);
  const thisWeekEnd = getWeekStart(now, 7);
  const lastWeekStart = getWeekStart(now, -7);
  const lastWeekEnd = thisWeekStart;

  const [thisWeekSessions, lastWeekSessions, thisWeekOrders, lastWeekOrders] =
    await Promise.all([
      getGa4SessionsForRange(thisWeekStart, thisWeekEnd),
      getGa4SessionsForRange(lastWeekStart, lastWeekEnd),
      getOrdersForRange(thisWeekStart, thisWeekEnd),
      getOrdersForRange(lastWeekStart, lastWeekEnd),
    ]);

  const performance: TrackPerformance[] = tracks.map((track) => {
    const curSessions = thisWeekSessions.filter((s) => s.utm_track === track.slug);
    const prevSessions = lastWeekSessions.filter((s) => s.utm_track === track.slug);
    const curOrders = thisWeekOrders.filter((o) => o.utm_track === track.slug);
    const prevOrders = lastWeekOrders.filter((o) => o.utm_track === track.slug);

    const curTotalSessions = curSessions.reduce((sum, s) => sum + s.sessions, 0);
    const prevTotalSessions = prevSessions.reduce((sum, s) => sum + s.sessions, 0);
    const curRevenue = curOrders.reduce((sum, o) => sum + o.amount_cents, 0);
    const prevRevenue = prevOrders.reduce((sum, o) => sum + o.amount_cents, 0);

    const clipSessionMap = new Map<string, number>();
    const clipOrderMap = new Map<string, number>();
    for (const s of curSessions) {
      if (s.utm_clip) {
        clipSessionMap.set(s.utm_clip, (clipSessionMap.get(s.utm_clip) ?? 0) + s.sessions);
      }
    }
    for (const o of curOrders) {
      if (o.utm_clip) {
        clipOrderMap.set(o.utm_clip, (clipOrderMap.get(o.utm_clip) ?? 0) + 1);
      }
    }
    const topClips = Array.from(clipSessionMap.entries())
      .map(([clipId, sessions]) => ({
        clip_id: parseInt(clipId, 10),
        sessions,
        orders: clipOrderMap.get(clipId) ?? 0,
      }))
      .sort((a, b) => b.orders * 10 + b.sessions - (a.orders * 10 + a.sessions))
      .slice(0, 5);

    return {
      track_slug: track.slug as TrackPerformance["track_slug"],
      track_name: track.name,
      current_week: {
        sessions: curTotalSessions,
        orders: curOrders.length,
        revenue_cents: curRevenue,
        conversion_rate: curTotalSessions > 0 ? curOrders.length / curTotalSessions : 0,
        top_clips: topClips,
      },
      previous_week: {
        sessions: prevTotalSessions,
        orders: prevOrders.length,
        revenue_cents: prevRevenue,
        conversion_rate: prevTotalSessions > 0 ? prevOrders.length / prevTotalSessions : 0,
        top_clips: [],
      },
    };
  });

  return NextResponse.json(performance);
}

function getWeekStart(base: Date, offsetDays: number): string {
  const d = new Date(base);
  const day = d.getDay();
  d.setDate(d.getDate() - day + offsetDays);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
