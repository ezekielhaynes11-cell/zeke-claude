import { NextRequest, NextResponse } from "next/server";
import { upsertCallLog } from "@/lib/db";

// Vapi sends POST events to this endpoint throughout the call lifecycle.
// Docs: https://docs.vapi.ai/server-url/events

export async function POST(req: NextRequest) {
  // Optionally verify the shared secret Vapi includes in x-vapi-secret
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret) {
    const incoming = req.headers.get("x-vapi-secret");
    if (incoming !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const event = await req.json();
  const type: string = event?.message?.type ?? event?.type ?? "";
  const call = event?.message?.call ?? event?.call ?? {};
  const callId: string = call?.id ?? "";

  if (!callId) {
    // Acknowledge events we don't have a call ID for (e.g. assistant-request)
    return NextResponse.json({ received: true });
  }

  switch (type) {
    case "call-started":
      await upsertCallLog(callId, { status: "in-progress" });
      break;

    case "function-call": {
      // Agent invoked the log_outcome tool
      const fn = event?.message?.functionCall ?? event?.functionCall ?? {};
      if (fn?.name === "log_outcome") {
        const params = fn?.parameters ?? {};
        await upsertCallLog(callId, {
          outcome: params.outcome ?? "pending",
          notes: params.notes,
          callbackDate: params.callbackDate,
        });
      }
      // Return the result back to Vapi so the conversation can continue
      return NextResponse.json({ result: "Outcome logged. Thank you." });
    }

    case "end-of-call-report":
    case "call-ended": {
      const artifact = event?.message?.artifact ?? {};
      const transcript: string = artifact?.transcript ?? "";
      const durationMs: number = call?.endedAt
        ? new Date(call.endedAt).getTime() - new Date(call.startedAt ?? call.createdAt).getTime()
        : 0;

      await upsertCallLog(callId, {
        status: "ended",
        endedAt: call.endedAt ?? new Date().toISOString(),
        duration: durationMs > 0 ? Math.round(durationMs / 1000) : undefined,
        transcript: transcript || undefined,
      });
      break;
    }

    case "call-failed":
      await upsertCallLog(callId, { status: "failed", outcome: "error" });
      break;

    default:
      // Ignore other event types (status-update, transcript, etc.)
      break;
  }

  return NextResponse.json({ received: true });
}
