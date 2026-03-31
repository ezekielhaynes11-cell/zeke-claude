import { NextRequest, NextResponse } from "next/server";
import { getContactById, createCallLog } from "@/lib/db";
import { initiateCall } from "@/lib/vapi";

export async function POST(req: NextRequest) {
  const { contactId } = await req.json();

  if (!contactId) {
    return NextResponse.json({ error: "contactId is required" }, { status: 400 });
  }

  const contact = await getContactById(contactId);
  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  if (!process.env.VAPI_API_KEY || !process.env.VAPI_PHONE_NUMBER_ID) {
    return NextResponse.json(
      { error: "VAPI_API_KEY and VAPI_PHONE_NUMBER_ID must be set in environment" },
      { status: 500 }
    );
  }

  let vapiCall;
  try {
    vapiCall = await initiateCall(contact.phone, contact.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  await createCallLog({
    id: vapiCall.id,
    contactId: contact.id,
    company: contact.company,
    phone: contact.phone,
    status: "initiated",
    outcome: "pending",
    startedAt: new Date().toISOString(),
  });

  return NextResponse.json({ callId: vapiCall.id, status: "initiated" });
}
