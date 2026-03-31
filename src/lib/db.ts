import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");
const CALL_LOGS_FILE = path.join(DATA_DIR, "call-logs.json");

export interface Contact {
  id: string;
  company: string;
  contactName: string;
  phone: string; // E.164 format: +15551234567
  state: string;
  notes?: string;
  addedAt: string;
}

export interface CallLog {
  id: string; // Vapi call ID
  contactId: string;
  company: string;
  phone: string;
  status: "initiated" | "in-progress" | "ended" | "failed";
  outcome:
    | "interested"
    | "not_interested"
    | "callback_requested"
    | "voicemail"
    | "no_answer"
    | "error"
    | "pending";
  callbackDate?: string;
  notes?: string;
  startedAt: string;
  endedAt?: string;
  duration?: number; // seconds
  transcript?: string;
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  const tmp = filePath + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, filePath);
}

// ── Contacts ─────────────────────────────────────────────────────────────────

export async function getContacts(): Promise<Contact[]> {
  return readJson<Contact[]>(CONTACTS_FILE, []);
}

export async function addContact(
  input: Omit<Contact, "id" | "addedAt">
): Promise<Contact> {
  const contacts = await getContacts();
  const contact: Contact = {
    ...input,
    id: `contact_${randomUUID().slice(0, 8)}`,
    addedAt: new Date().toISOString(),
  };
  contacts.push(contact);
  await writeJson(CONTACTS_FILE, contacts);
  return contact;
}

export async function getContactById(id: string): Promise<Contact | null> {
  const contacts = await getContacts();
  return contacts.find((c) => c.id === id) ?? null;
}

// ── Call Logs ─────────────────────────────────────────────────────────────────

export async function getCallLogs(contactId?: string): Promise<CallLog[]> {
  const logs = await readJson<CallLog[]>(CALL_LOGS_FILE, []);
  const filtered = contactId ? logs.filter((l) => l.contactId === contactId) : logs;
  return filtered.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export async function createCallLog(log: CallLog): Promise<void> {
  const logs = await readJson<CallLog[]>(CALL_LOGS_FILE, []);
  logs.push(log);
  await writeJson(CALL_LOGS_FILE, logs);
}

export async function upsertCallLog(
  id: string,
  updates: Partial<CallLog>
): Promise<CallLog | null> {
  const logs = await readJson<CallLog[]>(CALL_LOGS_FILE, []);
  const idx = logs.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  logs[idx] = { ...logs[idx], ...updates };
  await writeJson(CALL_LOGS_FILE, logs);
  return logs[idx];
}
