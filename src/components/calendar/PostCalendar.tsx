"use client";

import { useEffect, useState } from "react";
import type { Post, Platform } from "@/lib/types";

const PLATFORM_COLORS: Record<Platform, string> = {
  tiktok: "text-pink-400",
  instagram: "text-purple-400",
  youtube: "text-red-400",
};

const STATUS_BADGE: Record<string, string> = {
  published: "bg-green-500/20 text-green-400",
  scheduled: "bg-amber-500/20 text-amber-400",
  failed: "bg-red-500/20 text-red-400",
};

export default function PostCalendar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(postId: number) {
    if (!confirm("Delete this post from the platform and the log?")) return;
    setDeleting(postId);
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-[var(--brand-surface)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-12 text-center">
        <p className="text-4xl mb-3">📅</p>
        <p className="text-white font-medium">No posts yet</p>
        <p className="text-[var(--brand-muted)] text-sm mt-1">
          Posts appear here after clips are approved and published.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--brand-border)] text-left">
            <th className="px-4 py-3 text-[var(--brand-muted)] font-medium">Date</th>
            <th className="px-4 py-3 text-[var(--brand-muted)] font-medium">Platform</th>
            <th className="px-4 py-3 text-[var(--brand-muted)] font-medium">Account</th>
            <th className="px-4 py-3 text-[var(--brand-muted)] font-medium">Track</th>
            <th className="px-4 py-3 text-[var(--brand-muted)] font-medium">Status</th>
            <th className="px-4 py-3 text-[var(--brand-muted)] font-medium">UTM link</th>
            <th className="px-4 py-3 text-[var(--brand-muted)] font-medium w-8"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--brand-border)]">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString()
                  : new Date(post.created_at).toLocaleDateString()}
              </td>
              <td className={`px-4 py-3 font-medium capitalize ${PLATFORM_COLORS[post.platform ?? "tiktok"]}`}>
                {post.platform}
              </td>
              <td className="px-4 py-3 text-gray-300">{post.profile_name}</td>
              <td className="px-4 py-3 text-gray-400 capitalize">{post.track_slug?.replace("_", " ")}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[post.status] ?? ""}`}>
                  {post.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {post.utm_link ? (
                  <a
                    href={post.utm_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-gold)] hover:underline text-xs truncate max-w-xs block"
                  >
                    {post.utm_link.slice(0, 60)}…
                  </a>
                ) : (
                  <span className="text-[var(--brand-muted)]">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className="text-[var(--brand-muted)] hover:text-[var(--brand-red)] transition-colors text-xs disabled:opacity-50"
                >
                  {deleting === post.id ? "…" : "✕"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
