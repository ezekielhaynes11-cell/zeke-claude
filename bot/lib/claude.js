import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// claude-sonnet-4-20250514 is deprecated; replacement is claude-sonnet-4-6 (retires June 15 2026)
const MODEL = 'claude-sonnet-4-20250514'

// How many messages to send to Claude (sliding window)
const MAX_CONTEXT = 20
// How many messages to persist in Supabase
const MAX_STORED = 100

export async function getReply(history, userMessage) {
  const context = [
    ...history.slice(-MAX_CONTEXT),
    { role: 'user', content: userMessage },
  ]

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: process.env.SYSTEM_PROMPT,
    messages: context,
  })

  const reply = response.content.find((b) => b.type === 'text')?.text ?? ''

  const updatedHistory = [
    ...history,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: reply },
  ].slice(-MAX_STORED)

  return { reply, updatedHistory }
}
