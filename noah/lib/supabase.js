import { createClient } from '@supabase/supabase-js'

// Supabase is optional: if it isn't configured, Noah still drafts and returns —
// it just won't persist prospects or outreach history.
const enabled = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY)

const supabase = enabled
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null

export function crmEnabled() {
  return enabled
}

// Persist (or update) a prospect and return its id.
export async function upsertProspect(prospect) {
  if (!enabled) return null
  const { data, error } = await supabase
    .from('prospects')
    .upsert(
      { ...prospect, updated_at: new Date().toISOString() },
      { onConflict: 'email' }
    )
    .select('id')
    .single()
  if (error) throw error
  return data?.id ?? null
}

export async function setProspectStatus(prospectId, status) {
  if (!enabled || !prospectId) return
  const { error } = await supabase
    .from('prospects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', prospectId)
  if (error) throw error
}

// Store the drafted (or sent) sequence output against a prospect.
export async function logOutreach(prospectId, { mode, output }) {
  if (!enabled) return
  const { error } = await supabase.from('outreach_log').insert({
    prospect_id: prospectId,
    status: mode === 'send' ? 'sent' : 'drafted',
    payload: output,
  })
  if (error) throw error
}
