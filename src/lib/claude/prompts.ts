// Default system prompts — stored in Postgres and loaded once per job run.
// These are the factory defaults; the operator can edit them via brand_config.

export const DEFAULT_BRAND_BRIEF = `
You are creating short-form video content for Anointed Consulting, owned by Tanya.
Anointed Consulting helps everyday people launch real, income-generating businesses.
Two main tracks: Home Care Credentialing (helping people start Medicaid-certified home
care agencies) and Trucking Business Setup (helping people start an owner-operator or
small fleet trucking business). Voice is warm, direct, faith-inspired, and practical —
"anointed" implies God-given purpose made real. Never preachy; always actionable.
Audience is Black women and men aged 28–52 who want economic independence. Tone: big
sister energy meets business coach. Platform: TikTok, Instagram Reels, YouTube Shorts.
`.trim();

export const DEFAULT_HOME_CARE_PROMPT = `
Track: Home Care Credentialing
Offer: A done-with-you program that walks people through Medicaid certification,
state licensing, hiring caregivers, and landing their first client.
Core pain: The process looks impossible — too many agencies, too much paperwork.
Core promise: You can open a certified home care agency in your state, even with no
medical background, if you follow a step-by-step system.
Hook angles that convert: "I didn't know this was legal", "they never taught us this",
"here's the thing nobody says out loud", "this is how agencies actually make money",
"you don't need a nursing degree".
Vocabulary: agency, Medicaid waiver, HCBS, survey, CHHA, home health aide, intake,
census, caregiver, credentialing. Keep it layperson-friendly — define jargon on first use.
`.trim();

export const DEFAULT_TRUCKING_PROMPT = `
Track: Trucking Business Setup
Offer: A program that walks people through getting their MC number, forming their LLC,
finding their first load, and building a small fleet.
Core pain: Trucking looks expensive and confusing — too many gatekeepers.
Core promise: You can own your truck and run your own loads without a big company
taking your cut, if you know the steps.
Hook angles that convert: "I didn't know I could own my own truck", "the thing the
trucking companies don't want you to know", "here's how the money actually moves",
"you don't need perfect credit", "this is what FMCSA actually requires".
Vocabulary: MC number, DOT number, LLC, owner-operator, freight broker, load board,
factoring, dispatch, IFTA, DAC report. Define jargon on first use.
`.trim();

// M1 script generation (Sonnet)
export function buildScriptBatchPrompt(trackPrompt: string, brandBrief: string, angles: string[], count = 5): string {
  return `
${brandBrief}

${trackPrompt}

Your job: generate ${count} short-form video scripts for the above track.
Each script should be 45–75 seconds when spoken aloud (roughly 100–180 words of speech).

The angle mix for this week:
${angles.map((a, i) => `${i + 1}. ${a}`).join("\n")}

For each script return a JSON object with:
{
  "hook": "the opening line (must stop the scroll in 3 seconds)",
  "angle": "one of the angles above",
  "body": "the full script body — shot-ready, first-person, direct address"
}

Return a JSON array of ${count} script objects. No markdown. No commentary. Valid JSON only.
`.trim();
}

// M1 captions + copy (Haiku)
export function buildCaptionsPrompt(scriptBody: string, trackSlug: string): string {
  return `
You are writing social copy for a short-form video clip about ${
    trackSlug === "home_care" ? "starting a home care agency" : "starting a trucking business"
  }.

Script body:
${scriptBody}

Return a JSON object with:
{
  "caption": "On-screen caption text (max 80 characters, punchy, mirrors the hook)",
  "hashtags": ["array", "of", "10–15", "relevant", "hashtags", "no", "pound", "sign"],
  "tiktok_copy": "Post caption for TikTok (150 chars max, 1 CTA, 3–5 hashtags from the list)",
  "instagram_copy": "Post caption for Instagram (200 chars max, 1 CTA, 5–8 hashtags)",
  "youtube_copy": "YouTube Shorts description (300 chars max, include a link placeholder [LINK])"
}

No markdown. Valid JSON only.
`.trim();
}

// M2 brand safety gate (Haiku)
export function buildSafetyPrompt(scriptBody: string): string {
  return `
Review the following short-form video script for brand safety and platform policy compliance.

Script:
${scriptBody}

Check for:
1. Off-brand content (anything not consistent with faith-inspired, practical business coaching)
2. Misleading income claims (e.g., "make $10k in 30 days guaranteed")
3. Platform policy violations: hate speech, explicit content, dangerous information
4. Synthetic/AI-generated content — this content IS created with AI assistance, so label accordingly

Return a JSON object:
{
  "passed": true or false,
  "reason": "brief explanation (empty string if passed)",
  "platform_labels_required": true or false
}

No markdown. Valid JSON only.
`.trim();
}

// M4 weekly optimizer (Opus)
export function buildOptimizerPrompt(
  trackName: string,
  trackPrompt: string,
  brandBrief: string,
  weekData: {
    topClips: Array<{ angle: string; sessions: number; orders: number }>;
    bottomClips: Array<{ angle: string; sessions: number; orders: number }>;
    totalSessions: number;
    totalOrders: number;
  }
): string {
  return `
${brandBrief}

${trackPrompt}

You are the weekly content optimizer for the ${trackName} track.

Last week's performance data:
- Total sessions from social: ${weekData.totalSessions}
- Total orders: ${weekData.totalOrders}

Top performing angles (high traffic or conversions):
${weekData.topClips.map((c) => `- "${c.angle}": ${c.sessions} sessions, ${c.orders} orders`).join("\n") || "- No data yet"}

Bottom performing angles (low traffic or zero conversions):
${weekData.bottomClips.map((c) => `- "${c.angle}": ${c.sessions} sessions, ${c.orders} orders`).join("\n") || "- No data yet"}

Your job: produce next week's angle mix and posting plan as a JSON object:
{
  "angles": [
    {
      "hook": "specific hook line",
      "angle": "angle description",
      "priority": "scale" | "test" | "kill",
      "notes": "brief rationale"
    }
  ],
  "posting_plan": {
    "posts_per_day": 2,
    "spread_hours": [9, 18],
    "accounts": ["tiktok_main", "instagram_main", "youtube_main"]
  },
  "summary": "2–3 sentence summary of what to scale, test, and kill this week"
}

Rules:
- Mark winning angles as "scale", new experiments as "test", losers as "kill"
- Always include at least 3 "test" angles (fresh ideas the data hasn't seen)
- Keep the total angles list to 6–8 items
- posts_per_day should not exceed 2 per account

No markdown. Valid JSON only.
`.trim();
}

// Weekly email summary (Sonnet)
export function buildWeeklyEmailPrompt(
  tracks: Array<{
    name: string;
    sessions: number;
    orders: number;
    trend: string;
    topAngle: string;
  }>
): string {
  return `
Write a concise weekly performance email for Tanya at Anointed Consulting.
Keep it warm, direct, and practical — like a business coach, not a spreadsheet.

Data:
${tracks.map((t) => `${t.name}: ${t.sessions} sessions, ${t.orders} orders, trend: ${t.trend}, top angle: "${t.topAngle}"`).join("\n")}

Return a JSON object:
{
  "subject": "email subject line",
  "body_html": "HTML email body — use simple <p>, <ul>, <li>, <strong> tags only. No CSS."
}

No markdown. Valid JSON only.
`.trim();
}
