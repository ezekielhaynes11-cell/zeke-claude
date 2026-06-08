import DeadLetterQueue from "@/components/dead-letter/DeadLetterQueue";

export const dynamic = "force-dynamic";

export default function DeadLetterPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Dead Letter Queue</h1>
        <p className="text-[var(--brand-muted)] text-sm mt-1">
          Failed jobs that need your attention. Mark as resolved once handled.
        </p>
      </div>
      <DeadLetterQueue />
    </div>
  );
}
