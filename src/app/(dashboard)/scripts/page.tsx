import ScriptBatchView from "@/components/scripts/ScriptBatchView";

export const dynamic = "force-dynamic";

export default function ScriptsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Script Batches</h1>
        <p className="text-[var(--brand-muted)] text-sm mt-1">
          Review and approve this week&apos;s AI-generated scripts before recording.
        </p>
      </div>
      <ScriptBatchView />
    </div>
  );
}
