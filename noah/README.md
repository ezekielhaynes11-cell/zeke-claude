# Noah — Yield Architect Outreach Agent

Noah is Ezekiel's dedicated outreach agent for **Yield Architect**
(https://architectyield.com). Its single job is the **highest possible
positive-reply rate**: every message Noah writes is specifically relevant to the
recipient, diagnosing their pain and mapping it to what Yield Architect delivers.

Noah runs as a small HTTP service (deployed on Railway). Its brain is Claude
(`claude-opus-4-8`) wired to **Ezekiel's gojiberry MCP** (`https://mcp.gojiberry.ai`)
through the Messages API MCP connector — that's how the agent gets *full access to
the MCP* to research prospects, read email history, check the calendar, update the
CRM, and (when authorized) send.

## Endpoints

| Method | Path        | Body                                             | Purpose |
|--------|-------------|--------------------------------------------------|---------|
| GET    | `/health`   | —                                                | Railway health check |
| POST   | `/outreach` | `{ "prospect": {...}, "mode": "draft" \| "send" }` | One prospect → personalized sequence |
| POST   | `/campaign` | `{ "prospects": [ {...} ], "mode": ... }`        | Many prospects |
| POST   | `/ask`      | `{ "task": "re-engage cold leads", "mode": ... }`| Free-form outreach task |

`mode` defaults to **`draft`** — Noah researches and writes but sends nothing.
Only `mode: "send"` authorizes Noah to use gojiberry send/enroll tools (human-in-
the-loop by default).

### Example

```bash
curl -X POST https://<your-railway-url>/outreach \
  -H 'Content-Type: application/json' \
  -d '{
    "mode": "draft",
    "prospect": {
      "name": "Dana Ruiz",
      "company": "Ruiz HVAC",
      "title": "Owner",
      "industry": "Home services / HVAC",
      "website": "ruizhvac.com",
      "notes": "Two techs, no receptionist, misses calls during jobs"
    }
  }'
```

Noah returns a JSON sequence (diagnosed pain, the Yield Architect angle, research
notes, and 4–6 personalized touches with subject-line variants) for you to approve.

## Environment variables

| Variable          | Required | Purpose |
|-------------------|----------|---------|
| `ANTHROPIC_API_KEY` | yes    | Claude access (Noah's brain) |
| `GOJIBERRY_TOKEN` | if your MCP needs auth | Bearer token for `https://mcp.gojiberry.ai` |
| `GOJIBERRY_MCP_URL` | no     | Override the MCP endpoint (defaults to `https://mcp.gojiberry.ai`) |
| `SUPABASE_URL`    | no       | CRM persistence (prospects + outreach log) |
| `SUPABASE_KEY`    | no       | CRM persistence |
| `PORT`            | no       | Defaults to 3000 |

Supabase is optional — without it Noah still drafts and returns; it just won't
persist. To enable persistence, run `schema.sql` in your Supabase project.

## Deploy on Railway

1. Point a Railway service at this repo with **root directory `noah/`**.
2. Set the environment variables above.
3. Railway builds with NIXPACKS and runs `node index.js`; health check is `/health`.

## Local

```bash
cd noah
npm install
ANTHROPIC_API_KEY=... GOJIBERRY_TOKEN=... npm run dev
```

## Guardrails

- **Draft by default.** Nothing sends unless a request explicitly passes `mode: "send"`.
- **Truth only.** No fabricated metrics, case studies, or client names — Noah
  verifies claims against architectyield.com and Ezekiel's materials.
- **Ezekiel's voice.** Direct, specific, no filler. If Noah can't make a message
  genuinely relevant, it says what research it's missing instead of writing fluff.
