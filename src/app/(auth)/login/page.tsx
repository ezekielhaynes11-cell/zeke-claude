"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/scripts");
      } else {
        const data = await res.json();
        setError(data.error ?? "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-gold)] mb-4">
          <span className="text-black font-bold text-lg">A</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">Anointed Traffic Engine</h1>
        <p className="text-[var(--brand-muted)] text-sm mt-1">Sign in to your operator account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="w-full bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--brand-gold)] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full bg-[var(--brand-surface)] border border-[var(--brand-border)] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--brand-gold)] transition-colors"
          />
        </div>

        {error && (
          <p className="text-[var(--brand-red)] text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--brand-gold)] hover:bg-amber-500 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
