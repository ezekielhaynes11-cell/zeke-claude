"use client";

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Contact {
  id: string;
  company: string;
  contactName: string;
  phone: string;
  state: string;
  notes?: string;
  addedAt: string;
}

interface CallLog {
  id: string;
  contactId: string;
  company: string;
  phone: string;
  status: string;
  outcome: string;
  callbackDate?: string;
  notes?: string;
  startedAt: string;
  endedAt?: string;
  duration?: number;
}

type Outcome = CallLog["outcome"];

// ── Helpers ───────────────────────────────────────────────────────────────────

const OUTCOME_STYLES: Record<string, string> = {
  interested: "bg-green-500/20 text-green-400 border border-green-500/40",
  callback_requested: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  voicemail: "bg-slate-500/20 text-slate-300 border border-slate-500/40",
  not_interested: "bg-red-500/20 text-red-400 border border-red-500/40",
  no_answer: "bg-slate-500/20 text-slate-400 border border-slate-500/40",
  error: "bg-red-700/20 text-red-500 border border-red-700/40",
  pending: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
};

const OUTCOME_LABELS: Record<string, string> = {
  interested: "Interested",
  callback_requested: "Callback",
  voicemail: "Voicemail",
  not_interested: "Not Interested",
  no_answer: "No Answer",
  error: "Error",
  pending: "In Progress",
};

function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const cls = OUTCOME_STYLES[outcome] ?? OUTCOME_STYLES.pending;
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {OUTCOME_LABELS[outcome] ?? outcome}
    </span>
  );
}

function formatDuration(seconds?: number) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LprSalesDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [callingId, setCallingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    company: "",
    contactName: "",
    phone: "",
    state: "",
    notes: "",
  });
  const [addError, setAddError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────

  async function fetchContacts() {
    const res = await fetch("/api/contacts");
    if (res.ok) setContacts(await res.json());
  }

  async function fetchLogs() {
    const res = await fetch("/api/calls/logs");
    if (res.ok) setLogs(await res.json());
  }

  useEffect(() => {
    fetchContacts();
    fetchLogs();
    const interval = setInterval(fetchLogs, 10_000);
    return () => clearInterval(interval);
  }, []);

  // ── Initiate call ──────────────────────────────────────────────────────────

  async function handleCall(contactId: string) {
    setCallingId(contactId);
    try {
      const res = await fetch("/api/calls/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Call failed");
      showToast("Call initiated — agent is dialing.", "success");
      fetchLogs();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to initiate call", "error");
    } finally {
      setCallingId(null);
    }
  }

  // ── Add contact ────────────────────────────────────────────────────────────

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setAddError(data.error ?? "Failed to add contact");
      return;
    }
    setContacts((prev) => [...prev, data]);
    setAddForm({ company: "", contactName: "", phone: "", state: "", notes: "" });
    setShowAddForm(false);
    showToast("Contact added.", "success");
  }

  // ── Toast ──────────────────────────────────────────────────────────────────

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-[Inter,sans-serif]">
      {/* Header */}
      <header className="border-b border-[#34495e] bg-[#2C3E50] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wide font-[Oswald,sans-serif] uppercase">
            AutoTrace Systems
          </h1>
          <p className="text-sm text-[#bdc3c7] mt-0.5">LPR Scanner — Outbound Sales Dialer</p>
        </div>
        <div className="text-right text-xs text-[#bdc3c7]">
          <div className="text-[#E74C3C] font-semibold text-sm">● LIVE</div>
          <div>Powered by Vapi.ai</div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-65px)]">
        {/* ── Left: Contacts ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[42%] border-r border-[#34495e] flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-[#34495e] flex items-center justify-between bg-[#2d2d2d]">
            <h2 className="font-semibold text-sm uppercase tracking-widest text-[#bdc3c7]">
              Contacts ({contacts.length})
            </h2>
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="text-xs bg-[#E74C3C] hover:bg-red-500 text-white px-3 py-1.5 rounded transition-colors"
            >
              {showAddForm ? "Cancel" : "+ Add Contact"}
            </button>
          </div>

          {/* Add contact form */}
          {showAddForm && (
            <form
              onSubmit={handleAddContact}
              className="px-5 py-4 border-b border-[#34495e] bg-[#232323] space-y-2"
            >
              {addError && (
                <p className="text-xs text-red-400 bg-red-900/20 rounded p-2">{addError}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  placeholder="Company"
                  value={addForm.company}
                  onChange={(e) => setAddForm((f) => ({ ...f, company: e.target.value }))}
                  className="bg-[#2d2d2d] border border-[#34495e] rounded px-3 py-1.5 text-sm placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C]"
                />
                <input
                  required
                  placeholder="Contact Name"
                  value={addForm.contactName}
                  onChange={(e) => setAddForm((f) => ({ ...f, contactName: e.target.value }))}
                  className="bg-[#2d2d2d] border border-[#34495e] rounded px-3 py-1.5 text-sm placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C]"
                />
                <input
                  required
                  placeholder="+15551234567"
                  value={addForm.phone}
                  onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                  className="bg-[#2d2d2d] border border-[#34495e] rounded px-3 py-1.5 text-sm placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C]"
                />
                <input
                  required
                  placeholder="State (e.g. TX)"
                  maxLength={2}
                  value={addForm.state}
                  onChange={(e) => setAddForm((f) => ({ ...f, state: e.target.value.toUpperCase() }))}
                  className="bg-[#2d2d2d] border border-[#34495e] rounded px-3 py-1.5 text-sm placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C]"
                />
              </div>
              <input
                placeholder="Notes (optional)"
                value={addForm.notes}
                onChange={(e) => setAddForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full bg-[#2d2d2d] border border-[#34495e] rounded px-3 py-1.5 text-sm placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C]"
              />
              <button
                type="submit"
                className="w-full bg-[#E74C3C] hover:bg-red-500 text-white py-1.5 rounded text-sm font-semibold transition-colors"
              >
                Save Contact
              </button>
            </form>
          )}

          {/* Contact list */}
          <div className="overflow-y-auto flex-1">
            {contacts.length === 0 ? (
              <p className="text-center text-[#bdc3c7]/50 text-sm mt-10">No contacts yet.</p>
            ) : (
              contacts.map((c) => {
                const recentLog = logs.find((l) => l.contactId === c.id);
                const isCalling = callingId === c.id;
                return (
                  <div
                    key={c.id}
                    className="px-5 py-4 border-b border-[#2d2d2d] hover:bg-[#252525] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{c.company}</div>
                        <div className="text-xs text-[#bdc3c7] mt-0.5">
                          {c.contactName} &middot; {c.state}
                        </div>
                        <div className="text-xs text-[#bdc3c7]/60 mt-0.5 font-mono">{c.phone}</div>
                        {c.notes && (
                          <div className="text-xs text-[#bdc3c7]/50 mt-1 italic truncate">{c.notes}</div>
                        )}
                        {recentLog && recentLog.outcome !== "pending" && (
                          <div className="mt-1.5">
                            <OutcomeBadge outcome={recentLog.outcome} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleCall(c.id)}
                        disabled={isCalling}
                        className="shrink-0 flex items-center gap-1.5 bg-[#E74C3C] hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                      >
                        {isCalling ? (
                          <>
                            <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                            Dialing…
                          </>
                        ) : (
                          <>&#128222; Call</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: Call Log ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[58%] flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-[#34495e] bg-[#2d2d2d] flex items-center justify-between">
            <h2 className="font-semibold text-sm uppercase tracking-widest text-[#bdc3c7]">
              Call Log ({logs.length})
            </h2>
            <span className="text-xs text-[#bdc3c7]/50">Auto-refreshes every 10s</span>
          </div>

          <div className="overflow-y-auto flex-1">
            {logs.length === 0 ? (
              <p className="text-center text-[#bdc3c7]/50 text-sm mt-16">
                No calls yet. Hit &ldquo;Call&rdquo; on a contact to start.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#232323] border-b border-[#34495e]">
                  <tr className="text-xs uppercase tracking-wider text-[#bdc3c7]/60">
                    <th className="text-left px-5 py-3">Company</th>
                    <th className="text-left px-3 py-3">Outcome</th>
                    <th className="text-left px-3 py-3">Duration</th>
                    <th className="text-left px-3 py-3">Time</th>
                    <th className="text-left px-3 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-[#2d2d2d] hover:bg-[#252525] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="font-medium truncate max-w-[160px]">{log.company}</div>
                        <div className="text-xs text-[#bdc3c7]/50 font-mono">{log.phone}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <OutcomeBadge outcome={log.outcome} />
                      </td>
                      <td className="px-3 py-3 text-[#bdc3c7] whitespace-nowrap">
                        {formatDuration(log.duration)}
                      </td>
                      <td className="px-3 py-3 text-xs text-[#bdc3c7]/70 whitespace-nowrap">
                        {formatTime(log.startedAt)}
                      </td>
                      <td className="px-3 py-3 text-xs text-[#bdc3c7]/60 max-w-[200px]">
                        {log.callbackDate && (
                          <span className="block text-yellow-400">
                            CB: {log.callbackDate}
                          </span>
                        )}
                        {log.notes ? (
                          <span className="line-clamp-2">{log.notes}</span>
                        ) : (
                          <span className="italic opacity-40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-700 text-white"
              : "bg-red-700 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
