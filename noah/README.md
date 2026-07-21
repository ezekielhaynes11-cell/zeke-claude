# Noah — GoJiBerry Outreach Compliance & Follow-up Agent

Noah is Ezekiel's outreach **quality agent** for **Yield Architect**
(https://architectyield.com). It does **not** replace GoJiBerry ("jibri") — GoJiBerry
runs the campaigns and does the sending. Noah is the layer that keeps the whole
system **communicating like a sharp human who did their homework**:

1. **Personalization & communication compliance** — audits the GoJiBerry agents and
   campaigns and flags (with exact fixes) any step that's generic, templated,
   spammy, off-voice, or missing personalization.
2. **Follow-up scheduler** — sweeps the unibox on a cadence, finds threads due for a
   follow-up (no reply, replies needing a response, prospects going cold), and
   drafts the personalized next touch.

The standard: no message ships or stays queued unless it names a specific pain for
that recipient and maps it to a concrete Yield Architect outcome — the thing that
drives reply rate.

Noah runs as a small HTTP service (Railway). Its brain is Claude (`claude-opus-4-8`)
wired to the **GoJiBerry MCP** (`https://mcp.gojiberry.ai`) via the Messages API MCP
connector — full access to the agents, campaigns, contacts, lists, and unibox.

## Endpoints

| Method | Path        | Body                                             | Purpose |
|--------|-------------|--------------------------------------------------|---------|
| GET    | `/health`   | —                                                | Railway health check |
| POST   | `/sweep`    | `{ "mode": "draft" \| "send" }`                    | Run the compliance + follow-up sweep now (same as the schedule) |
| POST   | `/review`   | `{ "target": "campaign X", "mode": ... }`        | Compliance review of agents/campaigns |
| POST   | `/outreach` | `{ "prospect": {...}, "mode": ... }`             | First-touch plan for one prospect |
| POST   | `/campaign` | `{ "prospects": [ {...} ], "mode": ... }`        | Plans for many prospects |
| POST   | `/ask`      | `{ "task": "re-engage cold leads", "mode": ... }`| Free-form task |

`mode` defaults to **`draft`** — Noah reviews and drafts but changes nothing.
Only `mode: "send"` authorizes Noah to update campaigns/agents or send unibox
messages (human-in-the-loop by default).

### The scheduler

On boot, Noah starts a recurring sweep (`SWEEP_INTERVAL_MINUTES`, default every 6h).
Each sweep runs the same logic as `POST /sweep`: audit personalization/compliance
across the GoJiBerry agents and campaigns, then draft every follow-up that's due.
Set `SWEEP_MODE=send` to let those sweeps act instead of just drafting.

### Token controls (so it doesn't run away)

Every sweep is bounded on several axes so an always-on agent can't quietly burn
budget:

- **Cadence** — `SWEEP_INTERVAL_MINUTES` (default every 6h). Lower it for freshness,
  raise it (or set `0`) to spend less.
- **Overlap lock** — a sweep never starts while the previous one is still running.
- **Daily cap** — `NOAH_DAILY_TOKEN_CAP` (default 750k tokens/UTC-day). Once a day's
  scheduled sweeps hit it, further scheduled sweeps are skipped until the next day.
  (Manual `POST /sweep` calls are human-initiated and bypass the cap.)
- **Effort** — `NOAH_EFFORT` defaults to `medium`, not `high` — routine compliance
  checks don't need maximum reasoning depth.
- **Bounded scope** — sweeps look at *active* agents/campaigns only, prioritize the
  most-overdue threads, cap follow-ups per sweep (`SWEEP_MAX_FOLLOWUPS`, default 25),
  and open a thread's full messages only when needed.
- **Per-run ceilings** — `NOAH_MAX_TURNS` (tool-loop turns) and `NOAH_MAX_TOKENS`
  (output per response); optional `NOAH_TOKEN_BUDGET` for a hard API-native budget.

Every sweep logs its actual token spend and the running daily total; `GET /` reports
`usageToday`.

### Example

```bash
curl -X POST https://<your-railway-url>/sweep -H 'Content-Type: application/json' -d '{}'
```

Returns JSON: a one-line health summary, `compliance_findings` (where + issue + fix),
and `followups_due` (contact, why now, diagnosed pain, Yield Architect angle, and the
personalized draft).

## Environment variables

| Variable          | Required | Purpose |
|-------------------|----------|---------|
| `ANTHROPIC_API_KEY` | yes    | Claude access (Noah's brain) |
| `GOJIBERRY_TOKEN` | if your MCP needs auth | Bearer token for `https://mcp.gojiberry.ai` |
| `GOJIBERRY_MCP_URL` | no     | Override the MCP endpoint (defaults to `https://mcp.gojiberry.ai`) |
| `SWEEP_INTERVAL_MINUTES` | no | Follow-up sweep cadence (default `360` = every 6h; `0` disables) |
| `SWEEP_MODE`      | no       | `draft` (default) or `send` for scheduled sweeps |
| `SWEEP_ON_BOOT`   | no       | `true` to run one sweep ~15s after startup |
| `SWEEP_MAX_FOLLOWUPS` | no   | Cap follow-ups drafted per sweep (default `25`) |
| `NOAH_DAILY_TOKEN_CAP` | no  | Skip scheduled sweeps past this many tokens/UTC-day (default `750000`; `0` = no cap) |
| `NOAH_EFFORT`     | no       | Reasoning effort / token spend: `low` \| `medium` (default) \| `high` \| `max` |
| `NOAH_MAX_TURNS`  | no       | Max tool-loop turns per run (default `12`) |
| `NOAH_MAX_TOKENS` | no       | Per-response output ceiling (default `12000`) |
| `NOAH_TOKEN_BUDGET` | no     | API-native per-run token budget (min `20000`; unset = off) |
| `SUPABASE_URL`    | no       | Optional prospect/outreach persistence |
| `SUPABASE_KEY`    | no       | Optional persistence |
| `PORT`            | no       | Defaults to 3000 |

Supabase is optional — without it Noah still runs; it just won't persist. To enable
persistence, run `schema.sql` in your Supabase project.

## Deploy on Railway

1. Point a Railway service at this repo with **root directory `noah/`**.
2. Set the environment variables above (at minimum `ANTHROPIC_API_KEY`, plus
   `GOJIBERRY_TOKEN` if your MCP requires auth).
3. Railway builds with NIXPACKS and runs `node index.js`; health check is `/health`.
   The follow-up scheduler starts automatically.

## Local

```bash
cd noah
npm install
ANTHROPIC_API_KEY=... GOJIBERRY_TOKEN=... SWEEP_INTERVAL_MINUTES=0 npm run dev
```

## Guardrails

- **Draft by default.** No campaign/agent edits and no sends unless a request (or
  `SWEEP_MODE`) explicitly authorizes it.
- **Truth only.** No fabricated metrics, case studies, or client names.
- **Ezekiel's voice.** Direct, specific, no filler. If Noah can't make a message
  genuinely relevant, it says what's missing instead of writing fluff.
