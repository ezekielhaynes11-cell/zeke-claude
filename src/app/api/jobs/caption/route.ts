// M2 Caption job — QStash job handler.
// Submits a clip to the captioning API, then re-enqueues the clip for safety gate.

import { NextResponse } from "next/server";
import { verifyQStashSignature, enqueueSafetyGate } from "@/lib/qstash";
import { getClip, updateClipStatus, addDeadLetter } from "@/lib/db";
import { submitCaptionJob, pollCaptionJob } from "@/lib/captioning";
import { put } from "@vercel/blob";
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

  // Skip if already past captioning
  if (!["uploaded", "captioning"].includes(clip.status)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await updateClipStatus(clip_id, "captioning");

    const jobId = await submitCaptionJob(clip.blob_url);
    await updateClipStatus(clip_id, "captioning", { caption_job_id: jobId });

    // Poll with retries (up to 10 attempts, 6s apart = ~1 min)
    let captionedUrl: string | null = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 6000));
      const { done, outputUrl, error } = await pollCaptionJob(jobId);
      if (done && outputUrl) {
        captionedUrl = outputUrl;
        break;
      }
      if (done && error) throw new Error(error);
    }

    if (!captionedUrl) throw new Error("Caption job timed out");

    // Copy the captioned video into Vercel Blob for durability
    const captionRes = await fetch(captionedUrl);
    if (!captionRes.ok) throw new Error("Failed to fetch captioned video");
    const blob = await captionRes.blob();
    const stored = await put(`clips/captioned/${clip_id}.mp4`, blob, {
      access: "public",
      contentType: "video/mp4",
    });

    await updateClipStatus(clip_id, "captioned", { captioned_blob_url: stored.url });

    // Proceed to safety gate
    await enqueueSafetyGate(clip_id);

    return NextResponse.json({ ok: true, captioned_url: stored.url });
  } catch (err) {
    await updateClipStatus(clip_id, "failed", { error_msg: String(err) });
    await addDeadLetter("caption", { clip_id }, String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
