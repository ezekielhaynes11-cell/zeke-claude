import 'node:process'
import express from 'express'
import { runNoah, prospectTask, sweepTask, reviewTask } from './lib/noah.js'
import { startScheduler, runSweep } from './lib/scheduler.js'
import {
  crmEnabled,
  upsertProspect,
  setProspectStatus,
  logOutreach,
} from './lib/supabase.js'

const app = express()
app.use(express.json({ limit: '1mb' }))

// ── Health check (Railway) ────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.sendStatus(200))

app.get('/', (_req, res) =>
  res.json({
    agent: 'Noah',
    role: 'Personalization & communication compliance layer over the GoJiBerry (jibri) outreach agent, plus follow-up scheduler',
    crm: crmEnabled() ? 'supabase' : 'disabled',
    sweep: {
      intervalMinutes: Number(process.env.SWEEP_INTERVAL_MINUTES ?? 360),
      mode: process.env.SWEEP_MODE ?? 'draft',
    },
    endpoints: {
      'POST /sweep': 'run the personalization/compliance + follow-up sweep now',
      'POST /review': 'compliance review of agents/campaigns (optional { target })',
      'POST /outreach': 'personalized first-touch plan for one prospect',
      'POST /campaign': 'plans for many prospects',
      'POST /ask': 'free-form outreach task for Noah',
    },
  })
)

// ── Follow-up + compliance sweep (also runs on the schedule) ──────────────────
// body: { mode?: "draft" | "send" }
app.post('/sweep', async (req, res) => {
  const { mode } = req.body ?? {}
  try {
    const result = await runSweep(mode)
    res.json(result)
  } catch (err) {
    console.error('[sweep endpoint]', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Compliance review only ────────────────────────────────────────────────────
// body: { target?: "campaign X" | "agent Y", mode?: "draft" | "send" }
app.post('/review', async (req, res) => {
  const { target, mode = 'draft' } = req.body ?? {}
  try {
    const result = await runNoah(reviewTask(target), { mode })
    res.json({ mode, target: target ?? 'all', ...result })
  } catch (err) {
    console.error('[review]', err)
    res.status(500).json({ error: err.message })
  }
})

// ── One prospect (first-touch plan) ──────────────────────────────────────────
// body: { prospect: {...}, mode?: "draft" | "send" }
app.post('/outreach', async (req, res) => {
  const { prospect, mode = 'draft' } = req.body ?? {}
  if (!prospect || typeof prospect !== 'object') {
    return res.status(400).json({ error: 'prospect object is required' })
  }
  try {
    const prospectId = crmEnabled() ? await upsertProspect(prospect) : null
    const result = await runNoah(prospectTask(prospect), { mode })

    if (prospectId) {
      await logOutreach(prospectId, { mode, output: result.text })
      await setProspectStatus(prospectId, mode === 'send' ? 'contacted' : 'drafted')
    }

    res.json({ mode, prospectId, ...result })
  } catch (err) {
    console.error('[outreach]', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Many prospects ────────────────────────────────────────────────────────────
// body: { prospects: [ {...}, ... ], mode?: "draft" | "send" }
app.post('/campaign', async (req, res) => {
  const { prospects, mode = 'draft' } = req.body ?? {}
  if (!Array.isArray(prospects) || prospects.length === 0) {
    return res.status(400).json({ error: 'prospects array is required' })
  }
  const results = []
  for (const prospect of prospects) {
    try {
      const prospectId = crmEnabled() ? await upsertProspect(prospect) : null
      const result = await runNoah(prospectTask(prospect), { mode })
      if (prospectId) {
        await logOutreach(prospectId, { mode, output: result.text })
        await setProspectStatus(
          prospectId,
          mode === 'send' ? 'contacted' : 'drafted'
        )
      }
      results.push({ prospect: prospect.name ?? prospect.email, prospectId, ...result })
    } catch (err) {
      console.error('[campaign]', prospect?.email, err)
      results.push({ prospect: prospect?.name ?? prospect?.email, error: err.message })
    }
  }
  res.json({ mode, count: results.length, results })
})

// ── Free-form task ────────────────────────────────────────────────────────────
// body: { task: "re-engage the prospects who went cold last month", mode?: ... }
app.post('/ask', async (req, res) => {
  const { task, mode = 'draft' } = req.body ?? {}
  if (!task || typeof task !== 'string') {
    return res.status(400).json({ error: 'task string is required' })
  }
  try {
    const result = await runNoah(task, { mode })
    res.json({ mode, ...result })
  } catch (err) {
    console.error('[ask]', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Noah listening on port ${PORT}`)
  startScheduler()
})
