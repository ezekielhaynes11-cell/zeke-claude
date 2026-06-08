import { NextResponse } from "next/server";
import { deletePost, sql } from "@/lib/db";
import { deletePost as ayrshareDelete } from "@/lib/ayrshare";
import type { Platform } from "@/lib/types";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = parseInt(id, 10);
  if (isNaN(postId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  // Fetch post details before deleting
  const { rows } = await sql`
    SELECT p.provider_post_id, a.platform, a.profile_id FROM posts p
    JOIN social_accounts a ON a.id = p.account_id
    WHERE p.id = ${postId}
  `;

  const row = rows[0];
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Try to delete from the provider (best-effort)
  if (row.provider_post_id) {
    try {
      await ayrshareDelete(
        row.provider_post_id as string,
        row.platform as Platform,
        undefined
      );
    } catch {
      // Provider delete failure is non-blocking — the local record still gets deleted
    }
  }

  await deletePost(postId);
  return NextResponse.json({ ok: true });
}
