import { Client, Receiver } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN ?? "" });

export const qstashReceiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY ?? "",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY ?? "",
});

function appUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base}${path}`;
}

export async function enqueueOptimizer() {
  await client.publishJSON({
    url: appUrl("/api/jobs/optimizer"),
    body: { triggered_at: new Date().toISOString() },
    retries: 2,
  });
}

export async function enqueueScriptBatch(trackId: number, weeklyPlanId: number) {
  await client.publishJSON({
    url: appUrl("/api/jobs/script-batch"),
    body: { track_id: trackId, weekly_plan_id: weeklyPlanId },
    retries: 2,
    // Deduplicate so the same plan doesn't generate two batches
    contentBasedDeduplication: true,
  });
}

export async function enqueueCaption(clipId: number) {
  await client.publishJSON({
    url: appUrl("/api/jobs/caption"),
    body: { clip_id: clipId },
    retries: 3,
  });
}

export async function enqueueSafetyGate(clipId: number) {
  await client.publishJSON({
    url: appUrl("/api/jobs/safety-gate"),
    body: { clip_id: clipId },
    retries: 2,
  });
}

export async function enqueuePublish(clipId: number) {
  await client.publishJSON({
    url: appUrl("/api/jobs/publish"),
    body: { clip_id: clipId },
    retries: 3,
  });
}

export async function enqueueGa4Pull(date: string) {
  await client.publishJSON({
    url: appUrl("/api/jobs/ga4-pull"),
    body: { date },
    retries: 2,
    contentBasedDeduplication: true,
  });
}

export async function verifyQStashSignature(req: Request): Promise<boolean> {
  const body = await req.clone().text();
  const signature = req.headers.get("upstash-signature") ?? "";
  try {
    await qstashReceiver.verify({ signature, body });
    return true;
  } catch {
    return false;
  }
}
