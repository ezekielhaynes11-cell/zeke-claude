// Returns a signed Vercel Blob upload URL and creates the clip record.
// After the client uploads, it calls back to trigger the caption job.

import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { createClip, getTracks } from "@/lib/db";
import { enqueueCaption as qstashCaption } from "@/lib/qstash";
import { z } from "zod";

const metaSchema = z.object({
  track_id: z.number(),
  script_id: z.number().optional(),
});

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_, clientPayload) => {
        const meta = metaSchema.parse(JSON.parse(clientPayload ?? "{}"));
        const tracks = await getTracks();
        const track = tracks.find((t) => t.id === meta.track_id);
        if (!track) throw new Error("Unknown track");

        return {
          allowedContentTypes: ["video/mp4", "video/quicktime", "video/webm"],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
          tokenPayload: JSON.stringify(meta),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const meta = metaSchema.parse(JSON.parse(tokenPayload ?? "{}"));
        const clipId = await createClip(meta.track_id, blob.url, meta.script_id);
        await qstashCaption(clipId);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
