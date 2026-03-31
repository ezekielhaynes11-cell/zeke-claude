import { NextRequest, NextResponse } from "next/server";
import { getContacts, addContact } from "@/lib/db";

export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { company, contactName, phone, state, notes } = body;

  if (!company || !contactName || !phone || !state) {
    return NextResponse.json(
      { error: "company, contactName, phone, and state are required" },
      { status: 400 }
    );
  }

  // Validate E.164 phone format
  if (!/^\+1\d{10}$/.test(phone)) {
    return NextResponse.json(
      { error: "phone must be in E.164 format, e.g. +15551234567" },
      { status: 400 }
    );
  }

  const contact = await addContact({ company, contactName, phone, state, notes });
  return NextResponse.json(contact, { status: 201 });
}
