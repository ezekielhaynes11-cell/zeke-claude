"use client";

import { useEffect, useState } from "react";
import type { TrackPerformance } from "@/lib/types";

function Trend({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return <span className="text-[var(--brand-muted)] text-xs">—</span>;
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  return (
    <span className={`text-xs font-medium ${up ? "text-green-400" : "text-red-400"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct)}%
    </span>
  );
}

function MetricCard({
  label,
  current,
  previous,
  format,
}: {
  label: string;
  current: number;
  previous: number;
  format?: (n: number) => string;
}) {
  const fmt = format ?? ((n) => n.toLocaleString());
  return (
    <div className="bg-[var(--brand-dark)] rounded-lg p-4 border border-[var(--brand-border)]">
      <p className="text-[var(--brand-muted)] text-xs">{label}</p>
      <p className="text-white text-2xl font-semibold mt-1">{fmt(current)}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-[var(--brand-muted)] text-xs">vs {fmt(previous)} last wk</p>
        <Trend current={current} previous={previous} />
      </div>
    </div>
  );
}

export default function TrackPerformanceView() {
  const [tracks, setTracks] = useState<TrackPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/performance")
      .then((r) => r.json())
      .then((d) => { setTracks(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-48 rounded-xl bg-[var(--brand-surface)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-12 text-center">
        <p className="text-4xl mb-3">📈</p>
        <p className="text-white font-medium">No performance data yet</p>
        <p className="text-[var(--brand-muted)] text-sm mt-1">
          Data appears once GA4 is connected and posts start driving traffic.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tracks.map((track) => (
        <div key={track.track_slug} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--brand-border)]">
            <h2 className="text-white font-semibold">{track.track_name}</h2>
          </div>

          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Sessions"
              current={track.current_week.sessions}
              previous={track.previous_week.sessions}
            />
            <MetricCard
              label="Orders"
              current={track.current_week.orders}
              previous={track.previous_week.orders}
            />
            <MetricCard
              label="Revenue"
              current={track.current_week.revenue_cents}
              previous={track.previous_week.revenue_cents}
              format={(n) => `$${(n / 100).toFixed(0)}`}
            />
            <MetricCard
              label="Conv. rate"
              current={track.current_week.conversion_rate}
              previous={track.previous_week.conversion_rate}
              format={(n) => `${(n * 100).toFixed(1)}%`}
            />
          </div>

          {track.current_week.top_clips.length > 0 && (
            <div className="px-6 pb-6">
              <p className="text-[var(--brand-muted)] text-xs font-medium mb-3 uppercase tracking-wide">
                Top clips this week
              </p>
              <div className="space-y-2">
                {track.current_week.top_clips.map((clip, i) => (
                  <div key={clip.clip_id} className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--brand-muted)] text-xs w-4">{i + 1}</span>
                    <span className="text-gray-400 font-mono text-xs">clip #{clip.clip_id}</span>
                    <span className="text-gray-300">{clip.sessions} sessions</span>
                    <span className="text-green-400">{clip.orders} orders</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
