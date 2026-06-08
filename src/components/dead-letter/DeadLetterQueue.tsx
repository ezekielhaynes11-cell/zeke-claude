"use client";

import { useEffect, useState } from "react";
import type { DeadLetterItem } from "@/lib/types";

const JOB_LABEL: Record<string, string> = {
  optimizer: "Weekly optimizer",
  script_batch: "Script batch",
  caption: "Caption job",
  safety_gate: "Safety gate",
  safety_gate_blocked: "Blocked by safety gate",
  publish: "Publish",
  publish_auth: "Publish (auth failure)",
  publish_cap_exceeded: "Publish (daily cap)",
  ga4_pull: "GA4 pull",
};

export default function DeadLetterQueue() {
  const [items, setItems] = useState<DeadLetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/dead-letter");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleResolve(id: number) {
    setResolving(id);
    await fetch(`/api/dead-letter/${id}`, { method: "PATCH" });
    await load();
    setResolving(null);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-[var(--brand-surface)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-12 text-center">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-white font-medium">Queue is clear</p>
        <p className="text-[var(--brand-muted)] text-sm mt-1">No unresolved failures.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-red-900/40 bg-[var(--brand-surface)] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-400 text-xs font-medium uppercase tracking-wide">
                  {JOB_LABEL[item.job_type] ?? item.job_type}
                </span>
                <span className="text-[var(--brand-muted)] text-xs">
                  attempt {item.attempts} · {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-white text-sm">{item.error_msg}</p>
              <details className="mt-2">
                <summary className="text-[var(--brand-muted)] text-xs cursor-pointer hover:text-gray-400">
                  Payload
                </summary>
                <pre className="mt-2 text-xs text-gray-400 bg-black/30 rounded p-3 overflow-x-auto">
                  {JSON.stringify(item.payload, null, 2)}
                </pre>
              </details>
            </div>
            <button
              onClick={() => handleResolve(item.id)}
              disabled={resolving === item.id}
              className="shrink-0 px-3 py-1.5 bg-[var(--brand-gold)] hover:bg-amber-500 text-black text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {resolving === item.id ? "…" : "Resolve"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
