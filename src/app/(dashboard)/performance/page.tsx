import TrackPerformanceView from "@/components/performance/TrackPerformanceView";

export const dynamic = "force-dynamic";

export default function PerformancePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Performance</h1>
        <p className="text-[var(--brand-muted)] text-sm mt-1">
          Per-track clicks, sessions, and conversions — this week vs last week.
        </p>
      </div>
      <TrackPerformanceView />
    </div>
  );
}
