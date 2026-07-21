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

// Build an outreach task for one prospect from a plain object.
export function prospectTask(prospect) {
  const lines = Object.entries(prospect)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')
  return `Build a personalized outreach sequence for this prospect. Research them,
diagnose the specific pain, map it to the single strongest Yield Architect
offering + outcome, and return the JSON per your output contract.

Prospect:
${lines}`
}
