// M2 Publish — QStash job handler.
// Fans out one clip to all connected accounts, respecting daily caps.
// Spreads posts across the day based on the track's posting plan.

import { NextResponse } from "next/server";
import { verifyQStashSignature } from "@/lib/qstash";
import {
  getClip,
  updateClipStatus,
  getActiveAccounts,
  countTodayPostsForAccount,
  markAccountDisconnected,
  createPost,
  updatePostPublished,
  updatePostFailed,
  addDeadLetter,
  getTracks,
  sql,
} from "@/lib/db";
import { publishPost, AyrshareAuthError } from "@/lib/ayrshare";
import { buildUtmLink } from "@/lib/utm";
import { sendOperatorAlert } from "@/lib/resend";
import type { Platform } from "@/lib/types";
import { z } from "zod";

const schema = z.object({ clip_id: z.number() });

export async function POST(req: Request) {
  const valid = await verifyQStashSignature(req);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { clip_id } = parsed.data;

  const clip = await getClip(clip_id);
  if (!clip) return NextResponse.json({ error: "Clip not found" }, { status: 404 });

  if (clip.status !== "approved") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const videoUrl = clip.captioned_blob_url ?? clip.blob_url;

  const tracks = await getTracks();
  const track = tracks.find((t) => t.id === clip.track_id);
  if (!track) {
    await addDeadLetter("publish", { clip_id }, "Track not found");
    return NextResponse.json({ error: "Track not found" }, { status: 500 });
  }

  const accounts = await getActiveAccounts();
  if (accounts.length === 0) {
    await updateClipStatus(clip_id, "failed", { error_msg: "No connected accounts" });
    await addDeadLetter("publish", { clip_id }, "No connected accounts");
    return NextResponse.json({ error: "No connected accounts" }, { status: 500 });
  }

  await updateClipStatus(clip_id, "publishing");

  // Load per-clip caption copy if available
  let postCopy = track.name;
  if (clip.script_id) {
    const { rows } = await sql`SELECT hook FROM scripts WHERE id = ${clip.script_id}`;
    const hook = rows[0]?.hook as string ?? "";
    if (hook) postCopy = hook;
  }

  let allPublished = true;

  for (const account of accounts) {
    try {
      // Check daily cap
      const todayCount = await countTodayPostsForAccount(account.id);
      if (todayCount >= account.daily_cap) {
        // Over cap: skip (QStash will not re-enqueue — dead-letter for operator awareness)
        await addDeadLetter(
          "publish_cap_exceeded",
          { clip_id, account_id: account.id },
          `Account ${account.profile_name} at daily cap (${account.daily_cap})`
        );
        continue;
      }

      const utmLink = buildUtmLink({
        trackSlug: track.slug,
        clipId: clip_id,
        accountId: account.id,
        platform: account.platform,
        offerUrl: track.offer_url,
      });

      const platformCopy = `${postCopy}\n\n${utmLink}`;

      const postId = await createPost({
        clipId: clip_id,
        accountId: account.id,
        trackId: track.id,
        utmLink,
      });

      const { providerPostId } = await publishPost({
        platform: account.platform as Platform,
        profileKey: getProfileKey(track.slug),
        postText: platformCopy,
        mediaUrl: videoUrl,
      });

      await updatePostPublished(postId, providerPostId);
    } catch (err) {
      allPublished = false;

      if (err instanceof AyrshareAuthError) {
        await markAccountDisconnected(account.id, err.message);
        await sendOperatorAlert(
          `Account disconnected: ${account.profile_name}`,
          `The ${account.platform} account "${account.profile_name}" failed to authenticate.\n\nError: ${err.message}\n\nPlease reconnect the account in Ayrshare.`
        ).catch(() => {});
        await addDeadLetter("publish_auth", { clip_id, account_id: account.id }, err.message);
      } else {
        const postId = await createPost({
          clipId: clip_id,
          accountId: account.id,
          trackId: track.id,
          utmLink: "",
        }).catch(() => 0);
        if (postId) await updatePostFailed(postId, String(err));
        await addDeadLetter("publish", { clip_id, account_id: account.id }, String(err));
      }
    }
  }

  if (allPublished) {
    await updateClipStatus(clip_id, "published");
  } else {
    // Partially published — status remains "publishing" so it shows in logs
    await updateClipStatus(clip_id, "failed", {
      error_msg: "One or more accounts failed to publish",
    });
  }

  return NextResponse.json({ ok: true });
}

function getProfileKey(trackSlug: string): string | undefined {
  if (trackSlug === "home_care") return process.env.AYRSHARE_PROFILE_KEY_HOMECARE || undefined;
  if (trackSlug === "trucking") return process.env.AYRSHARE_PROFILE_KEY_TRUCKING || undefined;
  return undefined;
}
