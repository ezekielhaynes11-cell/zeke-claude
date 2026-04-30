const GRAPH_API = 'https://graph.facebook.com/v21.0/me/messages'

function token() {
  return `access_token=${encodeURIComponent(process.env.PAGE_ACCESS_TOKEN)}`
}

async function post(body) {
  const res = await fetch(`${GRAPH_API}?${token()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Messenger API ${res.status}: ${text}`)
  }
  return res.json()
}

// Facebook limits individual messages to 2000 chars; split at word/newline boundaries.
function chunkText(text, maxLen = 2000) {
  if (text.length <= maxLen) return [text]
  const chunks = []
  let start = 0
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length)
    if (end < text.length) {
      const nl = text.lastIndexOf('\n', end)
      const sp = text.lastIndexOf(' ', end)
      if (nl > start) end = nl + 1
      else if (sp > start) end = sp + 1
    }
    const chunk = text.slice(start, end).trim()
    if (chunk) chunks.push(chunk)
    start = end
  }
  return chunks
}

export async function sendTypingOn(recipientId) {
  await post({ recipient: { id: recipientId }, sender_action: 'typing_on' }).catch(
    () => {}
  )
}

export async function sendMessage(recipientId, text) {
  for (const chunk of chunkText(text)) {
    await post({
      recipient: { id: recipientId },
      message: { text: chunk },
      messaging_type: 'RESPONSE',
    })
  }
}
