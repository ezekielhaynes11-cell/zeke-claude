import Anthropic from "@anthropic-ai/sdk";

// Model routing as specified
const MODEL_OPUS = "claude-opus-4-8";
const MODEL_SONNET = "claude-sonnet-4-6";
const MODEL_HAIKU = "claude-haiku-4-5-20251001";

// Max token budgets per step
const BUDGETS = {
  optimizer: 2048,
  script_batch: 4096,
  captions: 512,
  safety: 256,
  email: 1024,
} as const;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function callWithRetry(
  model: string,
  system: string,
  userMessage: string,
  maxTokens: number,
  retries = 2
): Promise<string> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const msg = await client.messages.create({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: userMessage }],
      });
      const block = msg.content[0];
      if (block.type !== "text") throw new Error("Unexpected content type");
      return block.text;
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

function parseJson<T>(raw: string): T {
  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(cleaned) as T;
}

// M4 optimizer — Opus
export async function runOptimizer(system: string, userPrompt: string) {
  const raw = await callWithRetry(MODEL_OPUS, system, userPrompt, BUDGETS.optimizer);
  return parseJson<{
    angles: Array<{ hook: string; angle: string; priority: string; notes: string }>;
    posting_plan: { posts_per_day: number; spread_hours: number[]; accounts: string[] };
    summary: string;
  }>(raw);
}

// M1 script batch — Sonnet
export async function generateScriptBatch(system: string, userPrompt: string): Promise<
  Array<{ hook: string; angle: string; body: string }>
> {
  const raw = await callWithRetry(MODEL_SONNET, system, userPrompt, BUDGETS.script_batch);
  return parseJson(raw);
}

// M1 captions + copy — Haiku
export async function generateCaptions(system: string, userPrompt: string): Promise<{
  caption: string;
  hashtags: string[];
  tiktok_copy: string;
  instagram_copy: string;
  youtube_copy: string;
}> {
  const raw = await callWithRetry(MODEL_HAIKU, system, userPrompt, BUDGETS.captions);
  return parseJson(raw);
}

// M2 brand safety gate — Haiku
export async function checkBrandSafety(system: string, userPrompt: string): Promise<{
  passed: boolean;
  reason: string;
  platform_labels_required: boolean;
}> {
  const raw = await callWithRetry(MODEL_HAIKU, system, userPrompt, BUDGETS.safety);
  return parseJson(raw);
}

// Weekly email summary — Sonnet
export async function generateWeeklyEmail(system: string, userPrompt: string): Promise<{
  subject: string;
  body_html: string;
}> {
  const raw = await callWithRetry(MODEL_SONNET, system, userPrompt, BUDGETS.email);
  return parseJson(raw);
}
