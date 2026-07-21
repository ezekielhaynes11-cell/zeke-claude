import { runNoah, sweepTask } from './noah.js'

// Follow-up scheduler: on a fixed cadence, Noah sweeps the GoJiBerry system for
// personalization/compliance issues and follow-ups that are due, and produces the
// next touches. Draft by default — set SWEEP_MODE=send to let Noah act.
//
// Config:
//   SWEEP_INTERVAL_MINUTES  how often to sweep (default 360 = every 6h; 0 = off)
//   SWEEP_MODE              "draft" (default) | "send"
//   SWEEP_ON_BOOT           "true" to run one sweep shortly after startup
//   NOAH_DAILY_TOKEN_CAP    skip scheduled sweeps once this many tokens are spent
//                           in a UTC day (default 750000; 0 = no cap)

let running = false

// ── Daily token accounting (guards scheduled sweeps against runaway spend) ────
const DAILY_CAP = Number(process.env.NOAH_DAILY_TOKEN_CAP ?? 750000)
let capDay = utcDay()
let usedToday = 0

function utcDay() {
  return new Date().toISOString().slice(0, 10)
}

function noteUsage(usage) {
  const today = utcDay()
  if (today !== capDay) {
    capDay = today
    usedToday = 0
  }
  usedToday += (usage?.input_tokens ?? 0) + (usage?.output_tokens ?? 0)
}

function overDailyCap() {
  if (!Number.isFinite(DAILY_CAP) || DAILY_CAP <= 0) return false
  if (utcDay() !== capDay) return false // new day resets on next noteUsage
  return usedToday >= DAILY_CAP
}

export function usageStatus() {
  return { day: capDay, usedToday, dailyCap: DAILY_CAP }
}

export async function runSweep(mode = process.env.SWEEP_MODE ?? 'draft') {
  if (running) {
    console.log('[sweep] previous sweep still running — skipping this tick')
    return null
  }
  running = true
  const startedAt = new Date().toISOString()
  try {
    console.log(`[sweep] start (${mode}) ${startedAt}`)
    const result = await runNoah(sweepTask(), { mode })
    noteUsage(result.totalUsage)
    console.log(
      `[sweep] done — ${result.totalUsage?.output_tokens ?? '?'} out / ` +
        `${result.totalUsage?.input_tokens ?? '?'} in tokens; ` +
        `day total ${usedToday}${DAILY_CAP > 0 ? `/${DAILY_CAP}` : ''}`
    )
    return { startedAt, mode, usageToday: usageStatus(), ...result }
  } catch (err) {
    console.error('[sweep] error', err)
    return { startedAt, mode, error: err.message }
  } finally {
    running = false
  }
}

export function startScheduler() {
  const minutes = Number(process.env.SWEEP_INTERVAL_MINUTES ?? 360)
  if (!Number.isFinite(minutes) || minutes <= 0) {
    console.log('[scheduler] disabled (set SWEEP_INTERVAL_MINUTES > 0 to enable)')
    return
  }

  const ms = minutes * 60 * 1000
  console.log(
    `[scheduler] follow-up sweep every ${minutes} min` +
      (DAILY_CAP > 0 ? `, daily token cap ${DAILY_CAP}` : ', no daily token cap')
  )

  const tick = () => {
    if (overDailyCap()) {
      console.log(
        `[scheduler] daily token cap reached (${usedToday}/${DAILY_CAP}) — skipping sweep`
      )
      return
    }
    runSweep() // fire-and-forget; runSweep guards overlap and never throws
  }

  setInterval(tick, ms)

  if (process.env.SWEEP_ON_BOOT === 'true') {
    setTimeout(tick, 15_000) // let the server become healthy first
  }
}
