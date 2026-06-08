"use client";

import { useEffect, useState } from "react";
import type { ScriptBatch } from "@/lib/types";

export default function ScriptBatchView() {
  const [batches, setBatches] = useState<ScriptBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/scripts");
    const data = await res.json();
    setBatches(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAction(batchId: number, action: "approve" | "reject") {
    setActionLoading(batchId);
    await fetch(`/api/scripts/${batchId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await load();
    setActionLoading(null);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-48 rounded-xl bg-[var(--brand-surface)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-12 text-center">
        <p className="text-4xl mb-3">✍️</p>
        <p className="text-white font-medium">No pending batches</p>
        <p className="text-[var(--brand-muted)] text-sm mt-1">
          The optimizer runs every Sunday night and generates new scripts.
        </p>
        <button
          onClick={async () => {
            await fetch("/api/cron/optimizer", { method: "POST" });
            setTimeout(load, 2000);
          }}
          className="mt-4 px-4 py-2 bg-[var(--brand-gold)] text-black text-sm font-semibold rounded-lg hover:bg-amber-500 transition-colors"
        >
          Run optimizer now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {batches.map((batch) => (
        <div key={batch.id} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] overflow-hidden">
          {/* Batch header */}
          <div className="px-6 py-4 border-b border-[var(--brand-border)] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{batch.track_name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                  {batch.scripts.length} scripts
                </span>
              </div>
              <p className="text-[var(--brand-muted)] text-xs mt-0.5">
                Generated {new Date(batch.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(batch.id, "reject")}
                disabled={actionLoading === batch.id}
                className="px-4 py-1.5 rounded-lg border border-[var(--brand-border)] text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-colors disabled:opacity-50"
              >
                Reject all
              </button>
              <button
                onClick={() => handleAction(batch.id, "approve")}
                disabled={actionLoading === batch.id}
                className="px-4 py-1.5 rounded-lg bg-[var(--brand-gold)] hover:bg-amber-500 text-black font-semibold text-sm transition-colors disabled:opacity-50"
              >
                {actionLoading === batch.id ? "Saving…" : "Approve batch"}
              </button>
            </div>
          </div>

          {/* Scripts */}
          <div className="divide-y divide-[var(--brand-border)]">
            {batch.scripts.map((script, i) => (
              <div key={script.id} className="px-6 py-5">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 text-[var(--brand-muted)] text-xs font-mono w-5 shrink-0">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[var(--brand-gold)] font-semibold text-sm leading-snug">
                      Hook: {script.hook}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">Angle: {script.angle}</p>
                    <p className="text-gray-300 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                      {script.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
