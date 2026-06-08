import { Resend } from "resend";

function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(key);
}

const FROM = () => process.env.RESEND_FROM_EMAIL ?? "noreply@anointedconsulting.com";
const TO = () => process.env.REPORT_EMAIL_TO ?? "";

export async function sendWeeklyReport(subject: string, htmlBody: string): Promise<void> {
  const to = TO();
  if (!to) throw new Error("REPORT_EMAIL_TO is not configured");
  const client = getClient();

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { error } = await client.emails.send({
        from: FROM(),
        to,
        subject,
        html: htmlBody,
      });
      if (error) throw new Error(error.message);
      return;
    } catch (err) {
      lastError = err as Error;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastError!;
}

export async function sendOperatorAlert(subject: string, body: string): Promise<void> {
  const to = TO();
  if (!to) return;
  const client = getClient();
  await client.emails.send({
    from: FROM(),
    to,
    subject: `[Anointed Alert] ${subject}`,
    html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
  });
}
