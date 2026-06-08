import { sql } from "@vercel/postgres";
import type {
  BrandConfig,
  Track,
  WeeklyPlan,
  ScriptBatch,
  Script,
  Clip,
  SocialAccount,
  Post,
  DeadLetterItem,
  Ga4Session,
  StanOrder,
} from "@/lib/types";

export { sql };

// ── Brand Config ─────────────────────────────────────────────────────────────

export async function getBrandConfig(): Promise<BrandConfig | null> {
  const { rows } = await sql<BrandConfig>`SELECT * FROM brand_config WHERE id = 1`;
  return rows[0] ?? null;
}

export async function upsertBrandConfig(data: Partial<BrandConfig>) {
  await sql`
    INSERT INTO brand_config (id, brief, home_care_system_prompt, trucking_system_prompt, stan_homecare_url, stan_trucking_url, updated_at)
    VALUES (1,
      COALESCE(${data.brief ?? null}, ''),
      COALESCE(${data.home_care_system_prompt ?? null}, ''),
      COALESCE(${data.trucking_system_prompt ?? null}, ''),
      COALESCE(${data.stan_homecare_url ?? null}, ''),
      COALESCE(${data.stan_trucking_url ?? null}, ''),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      brief = EXCLUDED.brief,
      home_care_system_prompt = EXCLUDED.home_care_system_prompt,
      trucking_system_prompt = EXCLUDED.trucking_system_prompt,
      stan_homecare_url = EXCLUDED.stan_homecare_url,
      stan_trucking_url = EXCLUDED.stan_trucking_url,
      updated_at = NOW()
  `;
}

// ── Tracks ───────────────────────────────────────────────────────────────────

export async function getTracks(): Promise<Track[]> {
  const { rows } = await sql<Track>`SELECT * FROM tracks WHERE active = TRUE ORDER BY id`;
  return rows;
}

export async function getTrackBySlug(slug: string): Promise<Track | null> {
  const { rows } = await sql<Track>`SELECT * FROM tracks WHERE slug = ${slug}`;
  return rows[0] ?? null;
}

// ── Weekly Plans ─────────────────────────────────────────────────────────────

export async function getLatestPlanForTrack(trackId: number): Promise<WeeklyPlan | null> {
  const { rows } = await sql<WeeklyPlan>`
    SELECT * FROM weekly_plans WHERE track_id = ${trackId}
    ORDER BY week_start DESC LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createWeeklyPlan(data: Omit<WeeklyPlan, "id" | "created_at">): Promise<WeeklyPlan> {
  const { rows } = await sql<WeeklyPlan>`
    INSERT INTO weekly_plans (track_id, week_start, angles, posting_plan, status)
    VALUES (${data.track_id}, ${data.week_start}, ${JSON.stringify(data.angles)}, ${JSON.stringify(data.posting_plan)}, ${data.status})
    RETURNING *
  `;
  return rows[0];
}

export async function activateWeeklyPlan(id: number) {
  await sql`UPDATE weekly_plans SET status = 'active' WHERE id = ${id}`;
}

// ── Script Batches ────────────────────────────────────────────────────────────

export async function getPendingBatches(): Promise<ScriptBatch[]> {
  const { rows } = await sql`
    SELECT b.*, t.slug as track_slug, t.name as track_name
    FROM script_batches b
    JOIN tracks t ON t.id = b.track_id
    WHERE b.status = 'pending'
    ORDER BY b.created_at DESC
  `;
  if (rows.length === 0) return [];
  const batches: ScriptBatch[] = await Promise.all(
    rows.map(async (row) => {
      const scripts = await getScriptsForBatch(row.id as number);
      return { ...row, scripts } as unknown as ScriptBatch;
    })
  );
  return batches;
}

export async function createScriptBatch(trackId: number, weeklyPlanId: number | null): Promise<number> {
  const { rows } = await sql`
    INSERT INTO script_batches (track_id, weekly_plan_id) VALUES (${trackId}, ${weeklyPlanId})
    RETURNING id
  `;
  return rows[0].id as number;
}

export async function approveBatch(batchId: number, approvedBy: string) {
  await sql`
    UPDATE script_batches SET status = 'approved', approved_by = ${approvedBy}, approved_at = NOW()
    WHERE id = ${batchId}
  `;
}

export async function rejectBatch(batchId: number) {
  await sql`UPDATE script_batches SET status = 'rejected' WHERE id = ${batchId}`;
}

// ── Scripts ──────────────────────────────────────────────────────────────────

export async function getScriptsForBatch(batchId: number): Promise<Script[]> {
  const { rows } = await sql<Script>`
    SELECT * FROM scripts WHERE batch_id = ${batchId} ORDER BY id
  `;
  return rows;
}

export async function createScript(data: Omit<Script, "id" | "created_at">): Promise<number> {
  const { rows } = await sql`
    INSERT INTO scripts (batch_id, track_id, hook, angle, body)
    VALUES (${data.batch_id}, ${data.track_id}, ${data.hook}, ${data.angle}, ${data.body})
    RETURNING id
  `;
  return rows[0].id as number;
}

// ── Clips ─────────────────────────────────────────────────────────────────────

export async function createClip(trackId: number, blobUrl: string, scriptId?: number): Promise<number> {
  const { rows } = await sql`
    INSERT INTO clips (track_id, blob_url, script_id)
    VALUES (${trackId}, ${blobUrl}, ${scriptId ?? null})
    RETURNING id
  `;
  return rows[0].id as number;
}

export async function getClip(id: number): Promise<Clip | null> {
  const { rows } = await sql`
    SELECT c.*, t.slug as track_slug FROM clips c
    JOIN tracks t ON t.id = c.track_id
    WHERE c.id = ${id}
  `;
  return (rows[0] ?? null) as Clip | null;
}

export async function updateClipStatus(id: number, status: Clip["status"], extra?: Partial<Clip>) {
  await sql`
    UPDATE clips SET
      status = ${status},
      captioned_blob_url = COALESCE(${extra?.captioned_blob_url ?? null}, captioned_blob_url),
      caption_job_id = COALESCE(${extra?.caption_job_id ?? null}, caption_job_id),
      safety_result = COALESCE(${extra?.safety_result ? JSON.stringify(extra.safety_result) : null}::jsonb, safety_result),
      error_msg = COALESCE(${extra?.error_msg ?? null}, error_msg)
    WHERE id = ${id}
  `;
}

export async function getDeadClips(): Promise<Clip[]> {
  const { rows } = await sql`
    SELECT c.*, t.slug as track_slug FROM clips c
    JOIN tracks t ON t.id = c.track_id
    WHERE c.status IN ('failed', 'blocked')
    ORDER BY c.created_at DESC
  `;
  return rows as unknown as Clip[];
}

// ── Social Accounts ───────────────────────────────────────────────────────────

export async function getActiveAccounts(): Promise<SocialAccount[]> {
  const { rows } = await sql<SocialAccount>`
    SELECT * FROM social_accounts WHERE status = 'connected' ORDER BY platform, profile_name
  `;
  return rows;
}

export async function getAllAccounts(): Promise<SocialAccount[]> {
  const { rows } = await sql<SocialAccount>`SELECT * FROM social_accounts ORDER BY platform, profile_name`;
  return rows;
}

export async function markAccountDisconnected(accountId: number, reason: string) {
  await sql`
    UPDATE social_accounts SET status = 'disconnected', last_disconnect_reason = ${reason}
    WHERE id = ${accountId}
  `;
}

export async function countTodayPostsForAccount(accountId: number): Promise<number> {
  const { rows } = await sql`
    SELECT COUNT(*) as cnt FROM posts
    WHERE account_id = ${accountId}
      AND published_at >= CURRENT_DATE
      AND published_at < CURRENT_DATE + INTERVAL '1 day'
      AND status = 'published'
  `;
  return Number(rows[0]?.cnt ?? 0);
}

// ── Posts ────────────────────────────────────────────────────────────────────

export async function createPost(data: {
  clipId: number;
  accountId: number;
  trackId: number;
  utmLink: string;
}): Promise<number> {
  const { rows } = await sql`
    INSERT INTO posts (clip_id, account_id, track_id, utm_link)
    VALUES (${data.clipId}, ${data.accountId}, ${data.trackId}, ${data.utmLink})
    RETURNING id
  `;
  return rows[0].id as number;
}

export async function updatePostPublished(postId: number, providerPostId: string) {
  await sql`
    UPDATE posts SET status = 'published', provider_post_id = ${providerPostId}, published_at = NOW()
    WHERE id = ${postId}
  `;
}

export async function updatePostFailed(postId: number, errorMsg: string) {
  await sql`UPDATE posts SET status = 'failed', error_msg = ${errorMsg} WHERE id = ${postId}`;
}

export async function deletePost(postId: number) {
  await sql`DELETE FROM posts WHERE id = ${postId}`;
}

export async function getRecentPosts(limit = 100): Promise<Post[]> {
  const { rows } = await sql`
    SELECT p.*, a.platform, a.profile_name, c.blob_url as clip_blob_url, t.slug as track_slug
    FROM posts p
    JOIN social_accounts a ON a.id = p.account_id
    JOIN clips c ON c.id = p.clip_id
    JOIN tracks t ON t.id = p.track_id
    ORDER BY p.created_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as Post[];
}

// ── Dead Letter ───────────────────────────────────────────────────────────────

export async function addDeadLetter(jobType: string, payload: Record<string, unknown>, errorMsg: string, attempts = 1) {
  await sql`
    INSERT INTO dead_letter (job_type, payload, error_msg, attempts)
    VALUES (${jobType}, ${JSON.stringify(payload)}, ${errorMsg}, ${attempts})
  `;
}

export async function getOpenDeadLetters(): Promise<DeadLetterItem[]> {
  const { rows } = await sql<DeadLetterItem>`
    SELECT * FROM dead_letter WHERE resolved_at IS NULL ORDER BY created_at DESC
  `;
  return rows;
}

export async function resolveDeadLetter(id: number) {
  await sql`UPDATE dead_letter SET resolved_at = NOW() WHERE id = ${id}`;
}

// ── GA4 Sessions ──────────────────────────────────────────────────────────────

export async function upsertGa4Sessions(rows: Omit<Ga4Session, "id" | "created_at">[]) {
  for (const r of rows) {
    await sql`
      INSERT INTO ga4_sessions (date, sessions, source, medium, campaign, utm_track, utm_clip, utm_account)
      VALUES (${r.date}, ${r.sessions}, ${r.source}, ${r.medium}, ${r.campaign}, ${r.utm_track ?? null}, ${r.utm_clip ?? null}, ${r.utm_account ?? null})
      ON CONFLICT ON CONSTRAINT idx_ga4_uniq DO UPDATE SET sessions = EXCLUDED.sessions
    `;
  }
}

export async function getGa4SessionsForRange(startDate: string, endDate: string): Promise<Ga4Session[]> {
  const { rows } = await sql<Ga4Session>`
    SELECT * FROM ga4_sessions WHERE date >= ${startDate} AND date <= ${endDate}
    ORDER BY date DESC
  `;
  return rows;
}

// ── Stan Orders ───────────────────────────────────────────────────────────────

export async function upsertStanOrder(data: Omit<StanOrder, "id">): Promise<void> {
  await sql`
    INSERT INTO stan_orders (order_id, product_id, track_id, amount_cents, utm_track, utm_clip, utm_account, raw, received_at)
    VALUES (${data.order_id}, ${data.product_id}, ${data.track_id ?? null}, ${data.amount_cents}, ${data.utm_track ?? null}, ${data.utm_clip ?? null}, ${data.utm_account ?? null}, ${JSON.stringify(data.raw)}, ${data.received_at})
    ON CONFLICT (order_id) DO NOTHING
  `;
}

export async function getOrdersForRange(startDate: string, endDate: string): Promise<StanOrder[]> {
  const { rows } = await sql<StanOrder>`
    SELECT * FROM stan_orders WHERE received_at >= ${startDate} AND received_at < ${endDate}
    ORDER BY received_at DESC
  `;
  return rows;
}
