import 'node:process'
import express from 'express'
import { getConversation, saveConversation } from './lib/supabase.js'
import { getReply } from './lib/claude.js'
import { sendMessage, sendTypingOn } from './lib/messenger.js'

const app = express()
app.use(express.json())

// Dedup: track recently processed message IDs to ignore retried deliveries.
const processed = new Set()
function markProcessed(mid) {
  processed.add(mid)
  if (processed.size > 2000) {
    processed.delete(processed.values().next().value)
  }
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.sendStatus(200))

// ── Webhook verification (Facebook challenge) ─────────────────────────────────
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verified')
    return res.status(200).send(challenge)
  }
  res.sendStatus(403)
})

// ── Webhook events ────────────────────────────────────────────────────────────
app.post('/webhook', (req, res) => {
  if (req.body.object !== 'page') return res.sendStatus(404)

  // Acknowledge immediately so Facebook doesn't retry
  res.sendStatus(200)

  for (const entry of req.body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id
      const text = event.message?.text

      // Ignore echoes, non-text messages, and already-handled events
      if (!senderId || !text || event.message?.is_echo) continue

      const mid = event.message?.mid
      if (mid) {
        if (processed.has(mid)) continue
        markProcessed(mid)
      }

      handleMessage(senderId, text).catch((err) =>
        console.error('[handleMessage]', senderId, err)
      )
    }
  }
})

// ── Core message handler ──────────────────────────────────────────────────────
async function handleMessage(senderId, text) {
  await sendTypingOn(senderId)

  const history = await getConversation(senderId)
  const { reply, updatedHistory } = await getReply(history, text)

  await sendMessage(senderId, reply)
  await saveConversation(senderId, updatedHistory)
}

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Bot listening on port ${PORT}`))
