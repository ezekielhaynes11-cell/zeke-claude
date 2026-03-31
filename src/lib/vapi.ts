const VAPI_BASE = "https://api.vapi.ai";

function vapiHeaders() {
  return {
    Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
    "Content-Type": "application/json",
  };
}

// ── Assistant configuration ───────────────────────────────────────────────────

function buildAssistantConfig(contactId: string) {
  return {
    name: "Alex — AutoTrace LPR Sales",
    firstMessage:
      "Hi, may I speak with the owner or manager in charge of your repossession operations? " +
      "Great — my name is Alex, and I'm calling on behalf of AutoTrace Systems. " +
      "I have a quick 60-second question for you — do you have just a moment?",
    model: {
      provider: "openai",
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Alex, an outbound sales representative for AutoTrace Systems. You are calling repossession companies to introduce our LPR scanner product.

PITCH SCRIPT (deliver naturally, approximately 60 seconds):
"We've developed a License Plate Recognition scanner that mounts to any repo vehicle and passively scans thousands of plates per hour as your agents drive normal routes. The moment it spots a vehicle on your recovery list, it sends an instant GPS alert to your phone.

Repo companies using our system are seeing about 40 percent more recoveries per week — same team, same routes — just finding more cars automatically. It integrates directly with most repo management software and we offer a 30-day pilot program for qualified companies.

Would you be open to a 15-minute walkthrough call this week to see if it's a fit for your operation?"

HANDLING RESPONSES:
- If INTERESTED: Thank them warmly. Tell them a specialist will call back within 24 hours to schedule a demo. Ask for their best callback time. Say goodbye professionally.
- If NOT INTERESTED: Thank them for their time. Ask politely if it would be okay to reach back in 90 days. Say goodbye respectfully.
- If CALLBACK REQUESTED: Ask for their preferred callback day and time. Confirm the details back to them. Thank them and say goodbye.
- If you reach VOICEMAIL: Leave this message exactly — "Hi, this is Alex from AutoTrace Systems. We help repossession companies find 40% more vehicles using LPR plate-scanning technology. I'll try you again, or you can reach us at 1-800-555-0199. Have a great day." Then end the call.
- Always be professional, concise, and never pushy.
- Keep responses brief — this is a phone call, not an essay.
- End the call gracefully once the interaction is complete.

CRITICAL INSTRUCTION: At the end of every call — regardless of outcome — you MUST call the log_outcome function before ending. Use the appropriate outcome value: interested, not_interested, callback_requested, voicemail, or no_answer. Include brief notes summarizing the conversation.

The contactId for this call is: ${contactId}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "log_outcome",
            description: "Log the outcome of this sales call. Call this before ending every call.",
            parameters: {
              type: "object",
              properties: {
                outcome: {
                  type: "string",
                  enum: [
                    "interested",
                    "not_interested",
                    "callback_requested",
                    "voicemail",
                    "no_answer",
                  ],
                  description: "The result of the call",
                },
                notes: {
                  type: "string",
                  description: "Brief notes about the conversation (1-2 sentences)",
                },
                callbackDate: {
                  type: "string",
                  description:
                    "If callback_requested, when they want to be called back (e.g. 'Tuesday afternoon')",
                },
              },
              required: ["outcome"],
            },
          },
        },
      ],
    },
    voice: {
      provider: "11labs",
      voiceId: "burt", // Professional male voice
    },
    endCallFunctionEnabled: true,
    recordingEnabled: true,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface VapiCallResult {
  id: string;
  status: string;
  phoneNumberId: string;
  customer: { number: string };
}

export async function initiateCall(
  toPhone: string,
  contactId: string
): Promise<VapiCallResult> {
  const webhookBase = process.env.WEBHOOK_BASE_URL?.replace(/\/$/, "");

  const body = {
    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    customer: { number: toPhone },
    assistant: buildAssistantConfig(contactId),
    ...(webhookBase
      ? { serverUrl: `${webhookBase}/api/calls/webhook` }
      : {}),
  };

  const res = await fetch(`${VAPI_BASE}/call/phone`, {
    method: "POST",
    headers: vapiHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi call failed (${res.status}): ${err}`);
  }

  return res.json() as Promise<VapiCallResult>;
}
