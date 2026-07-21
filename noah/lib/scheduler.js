import { runNoah, sweepTask } from './noah.js'

// Follow-up scheduler: on a fixed cadence, Noah sweeps the GoJiBerry system for
// personalization/compliance issues and follow-ups that are due, and produces the
// next touches. Draft by default — set SWEEP_MODE=send to let Noah act.
//
// Config:
//   SWEEP_INTERVAL_MINUTES  how often to sweep (default 360 = every 6h; 0 = off)
//   SWEEP_MODE              "draft" (default) | "send"
//   SWEEP_ON_BOOT           "true" to run one sweep shortly after startup

let running = false

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
    console.log(`[sweep] done — ${result.usage?.output_tokens ?? '?'} output tokens`)
    return { startedAt, mode, ...result }
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
  console.log(`[scheduler] follow-up sweep every ${minutes} min`)

  // Fire-and-forget; runSweep guards against overlap and never throws.
  setInterval(() => {
    runSweep()
  }, ms)

  if (process.env.SWEEP_ON_BOOT === 'true') {
    // Small delay so the server is listening and healthy first.
    setTimeout(() => runSweep(), 15_000)
  }
}
