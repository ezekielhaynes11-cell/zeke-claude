import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './prompt.js'

const client = new Anthropic()

// claude-opus-4-8 is Anthropic's most capable Opus-tier model.
const MODEL = 'claude-opus-4-8'

// Ezekiel's MCP gateway — Noah's full access to his connected tools.
const MCP_URL = process.env.GOJIBERRY_MCP_URL ?? 'https://mcp.gojiberry.ai'

// The Messages API MCP connector: Claude reaches the gojiberry MCP server-side.
const MCP_BETA = 'mcp-client-2025-11-20'

// ── Token discipline ─────────────────────────────────────────────────────────
// Cap the server-side tool loop so a stuck run can't spin forever.
const MAX_TURNS = Number(process.env.NOAH_MAX_TURNS ?? 12)
// Effort controls thinking depth + overall token spend. Routine sweeps run
// 'medium' by default; raise to 'high' when you want maximum rigor.
const EFFORT = process.env.NOAH_EFFORT ?? 'medium'
// Hard per-response output ceiling.
const MAX_TOKENS = Number(process.env.NOAH_MAX_TOKENS ?? 12000)
// Optional API-native task budget: bounds tokens Claude generates + tool results
// it reads per run. Min 20000; unset/below-min = disabled.
const TASK_BUDGET = Number(process.env.NOAH_TOKEN_BUDGET ?? 0)
const TASK_BUDGET_BETA = 'task-budgets-2026-03-13'

const TASK_BUDGET_ON = TASK_BUDGET >= 20000

function mcpServers() {
  const server = { type: 'url', url: MCP_URL, name: 'gojiberry' }
  // gojiberry auth, if the server requires a bearer token.
  if (process.env.GOJIBERRY_TOKEN) {
    server.authorization_token = process.env.GOJIBERRY_TOKEN
  }
  return [server]
}

// Run Noah over a task. `mode` gates whether sending is authorized:
//   'draft' (default) — research + write; never call send/enroll tools.
//   'send'            — explicitly authorized to send/enroll for this batch.
export async function runNoah(task, { mode = 'draft' } = {}) {
  const authorization =
    mode === 'send'
      ? 'SENDING IS AUTHORIZED for this batch. After drafting, you may use the gojiberry tools to send email / enroll the sequence. Still respect every guardrail.'
      : 'DRAFT ONLY. Do not call any send or enroll tool. Research and read freely, but produce drafts for human approval — nothing leaves any account.'

  const messages = [
    { role: 'user', content: `${authorization}\n\n${task}` },
  ]

  const betas = TASK_BUDGET_ON ? [MCP_BETA, TASK_BUDGET_BETA] : [MCP_BETA]
  const outputConfig = { effort: EFFORT }
  if (TASK_BUDGET_ON) {
    outputConfig.task_budget = { type: 'tokens', total: TASK_BUDGET }
  }

  // Accumulate real spend across every turn of the loop, not just the last one.
  const totalUsage = { input_tokens: 0, output_tokens: 0 }

  let final
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      betas,
      thinking: { type: 'adaptive' },
      output_config: outputConfig,
      system: SYSTEM_PROMPT,
      mcp_servers: mcpServers(),
      tools: [{ type: 'mcp_toolset', mcp_server_name: 'gojiberry' }],
      messages,
    })

    totalUsage.input_tokens += response.usage?.input_tokens ?? 0
    totalUsage.output_tokens += response.usage?.output_tokens ?? 0

    // Preserve the full turn (tool_use / mcp blocks) for the next request.
    messages.push({ role: 'assistant', content: response.content })

    // Server-side tool loop hit its iteration cap — re-send to resume.
    if (response.stop_reason === 'pause_turn') continue

    final = response
    break
  }

  if (!final) {
    throw new Error(`Noah did not finish within ${MAX_TURNS} turns`)
  }

  const text = final.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()

  return { text, stopReason: final.stop_reason, usage: final.usage, totalUsage }
}

// Full sweep: personalization/compliance review of the GoJiBerry system + the
// follow-ups that are due right now. This is what the scheduler runs.
export function sweepTask() {
  const maxFollowups = Number(process.env.SWEEP_MAX_FOLLOWUPS ?? 25)
  return `Run your standard sweep over the GoJiBerry outreach system. Keep it
efficient — you don't need to read everything, and pulling the whole account
wastes tokens.

1. Compliance & personalization review: look at ACTIVE agents and campaigns only
   (skip paused/archived). For each, spot-check the message steps against the
   personalization standard and record compliance_findings for anything generic,
   templated, spammy, off-voice, or missing personalization — with the exact fix.
   Don't re-audit steps you've already flagged as fine.
2. Follow-ups due: use get_intent_type_counts and list_unibox_threads to find the
   threads that most need attention — no reply after ~2-4 business days, replies
   needing a response, prospects going cold. Prioritize the most overdue and
   highest-intent, and cap this at the top ${maxFollowups}. Only open a thread's
   full messages when you actually need them to write the follow-up.

Be economical with tool calls: batch and paginate in small pages, and stop once
you have what you need. Return the JSON per your output contract.`
}

// Compliance review only, optionally scoped to a specific agent/campaign.
export function reviewTask(target) {
  const scope = target
    ? `Focus on: ${target}.`
    : 'Cover every active agent and campaign.'
  return `Do a personalization and communication compliance review of the
GoJiBerry outreach system. ${scope} For each weak or non-compliant message step,
record a compliance_finding with the exact rewrite. Return the JSON per your
output contract (compliance_findings is the part that matters here).`
}

// Ad-hoc: build a personalized first-touch plan for one prospect.
export function prospectTask(prospect) {
  const lines = Object.entries(prospect)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')
  return `Build a personalized outreach plan for this prospect. Research them
(enrich via the GoJiBerry tools if the record is thin), diagnose the specific
pain, map it to the single strongest Yield Architect offering + outcome, and
return the JSON per your output contract (use followups_due for the touches).

Prospect:
${lines}`
}
