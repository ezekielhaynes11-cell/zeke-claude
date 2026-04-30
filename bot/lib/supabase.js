import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export async function getConversation(senderId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('messages')
    .eq('sender_id', senderId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.messages ?? []
}

export async function saveConversation(senderId, messages) {
  const { error } = await supabase
    .from('conversations')
    .upsert(
      { sender_id: senderId, messages, updated_at: new Date().toISOString() },
      { onConflict: 'sender_id' }
    )
  if (error) throw error
}
