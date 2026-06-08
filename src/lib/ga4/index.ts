// GA4 Data API v1beta via REST + service-account JWT auth.
// Avoids the heavyweight gRPC client library.

import { SignJWT } from "jose";

const PROPERTY_ID = () => process.env.GA4_PROPERTY_ID ?? "";
const SA_JSON_B64 = () => process.env.GA4_SERVICE_ACCOUNT_JSON ?? "";

interface ServiceAccount {
  client_email: string;
  private_key: string;
  private_key_id: string;
}

let _cachedToken: { token: string; expiry: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (_cachedToken && _cachedToken.expiry > Date.now() + 60_000) {
    return _cachedToken.token;
  }

  const saJson = JSON.parse(
    Buffer.from(SA_JSON_B64(), "base64").toString("utf-8")
  ) as ServiceAccount;

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(saJson.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/analytics.readonly",
  })
    .setProtectedHeader({ alg: "RS256", kid: saJson.private_key_id })
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .setIssuer(saJson.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .sign(privateKey);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const tokenData = (await tokenRes.json()) as { access_token: string; expires_in: number };
  _cachedToken = {
    token: tokenData.access_token,
    expiry: Date.now() + tokenData.expires_in * 1000,
  };
  return _cachedToken.token;
}

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export interface Ga4Row {
  date: string;
  source: string;
  medium: string;
  campaign: string;
  content: string; // utm_content = clip_id
  term: string;    // utm_term = account_id
  sessions: number;
}

export async function pullGa4Sessions(startDate: string, endDate: string): Promise<Ga4Row[]> {
  const token = await getAccessToken();
  const propertyId = PROPERTY_ID();

  const body = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: "date" },
      { name: "sessionSource" },
      { name: "sessionMedium" },
      { name: "sessionCampaignName" },
      { name: "sessionManualAdContent" },
      { name: "sessionManualTerm" },
    ],
    metrics: [{ name: "sessions" }],
    dimensionFilter: {
      filter: {
        fieldName: "sessionMedium",
        stringFilter: { matchType: "EXACT", value: "social" },
      },
    },
    limit: 10000,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GA4 API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      rows?: Array<{
        dimensionValues: Array<{ value: string }>;
        metricValues: Array<{ value: string }>;
      }>;
    };

    return (data.rows ?? []).map((row) => ({
      date: row.dimensionValues[0].value,
      source: row.dimensionValues[1].value,
      medium: row.dimensionValues[2].value,
      campaign: row.dimensionValues[3].value,
      content: row.dimensionValues[4].value,
      term: row.dimensionValues[5].value,
      sessions: parseInt(row.metricValues[0].value, 10),
    }));
  } finally {
    clearTimeout(timeout);
  }
}
