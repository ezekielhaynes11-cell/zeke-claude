import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './prompt.js'

const client = new Anthropic()

// claude-opus-4-8 is Anthropic's most capable Opus-tier model.
const MODEL = 'claude-opus-4-8'

// Ezekiel's MCP gateway — Noah's full access to his connected tools.
const MCP_URL = process.env.GOJIBERRY_MCP_URL ?? 'https://mcp.gojiberry.ai'

// The Messages API MCP connector: Claude reaches the gojiberry MCP server-side.
const MCP_BETA = 'mcp-client-2025-11-20'

// Cap the server-side tool loop so a stuck run can't spin forever.
const MAX_TURNS = 12

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

  let final
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: [MCP_BETA],
      thinking: { type: 'adaptive' },
      system: SYSTEM_PROMPT,
      mcp_servers: mcpServers(),
      tools: [{ type: 'mcp_toolset', mcp_server_name: 'gojiberry' }],
      messages,
    })

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

  return { text, stopReason: final.stop_reason, usage: final.usage }
}

// Full sweep: personalization/compliance review of the GoJiBerry system + the
// follow-ups that are due right now. This is what the scheduler runs.
export function sweepTask() {
  return `Run your standard sweep over the GoJiBerry outreach system.

1. Compliance & personalization review: pull the active agents (list_agents /
   get_agent) and campaigns (list_campaigns / get_campaign). Judge each message
   step against the personalization standard and record compliance_findings for
   anything generic, templated, spammy, off-voice, or missing personalization —
   with the exact fix.
2. Follow-ups due: scan the unibox (list_unibox_threads, get_intent_type_counts)
   for threads with no reply after ~2-4 business days, replies that need a
   response, and prospects going cold. For each, produce a personalized next
   touch in followups_due.

Return the JSON per your output contract.`
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
