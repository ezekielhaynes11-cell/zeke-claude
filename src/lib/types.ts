export type TrackSlug = "home_care" | "trucking";

export type BatchStatus = "pending" | "approved" | "rejected";

export type ClipStatus =
  | "uploaded"
  | "captioning"
  | "captioned"
  | "safety_checking"
  | "approved"
  | "blocked"
  | "publishing"
  | "published"
  | "failed";

export type PostStatus = "scheduled" | "published" | "failed";

export type AccountStatus = "connected" | "disconnected";

export type Platform = "tiktok" | "instagram" | "youtube";

export interface BrandConfig {
  id: number;
  brief: string;
  home_care_system_prompt: string;
  trucking_system_prompt: string;
  stan_homecare_url: string;
  stan_trucking_url: string;
  updated_at: string;
}

export interface Track {
  id: number;
  slug: TrackSlug;
  name: string;
  offer_url: string;
  active: boolean;
}

export interface WeeklyPlan {
  id: number;
  track_id: number;
  week_start: string;
  angles: PlanAngle[];
  posting_plan: PostingPlan;
  status: "draft" | "active";
  created_at: string;
}

export interface PlanAngle {
  hook: string;
  angle: string;
  priority: "scale" | "test" | "kill";
  notes: string;
}

export interface PostingPlan {
  posts_per_day: number;
  spread_hours: number[];
  accounts: string[];
}

export interface ScriptBatch {
  id: number;
  track_id: number;
  track_slug: TrackSlug;
  track_name: string;
  weekly_plan_id: number | null;
  status: BatchStatus;
  scripts: Script[];
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface Script {
  id: number;
  batch_id: number;
  track_id: number;
  hook: string;
  angle: string;
  body: string;
  created_at: string;
}

export interface Clip {
  id: number;
  script_id: number | null;
  track_id: number;
  track_slug: TrackSlug;
  blob_url: string;
  captioned_blob_url: string | null;
  status: ClipStatus;
  caption_job_id: string | null;
  safety_result: SafetyResult | null;
  error_msg: string | null;
  created_at: string;
}

export interface SafetyResult {
  passed: boolean;
  reason: string;
  platform_labels_required: boolean;
}

export interface SocialAccount {
  id: number;
  platform: Platform;
  profile_id: string;
  profile_name: string;
  daily_cap: number;
  status: AccountStatus;
  last_disconnect_reason: string | null;
  created_at: string;
}

export interface Post {
  id: number;
  clip_id: number;
  account_id: number;
  track_id: number;
  provider_post_id: string | null;
  utm_link: string;
  status: PostStatus;
  published_at: string | null;
  error_msg: string | null;
  created_at: string;
  platform?: Platform;
  profile_name?: string;
  clip_blob_url?: string;
  track_slug?: TrackSlug;
}

export interface DeadLetterItem {
  id: number;
  job_type: string;
  payload: Record<string, unknown>;
  error_msg: string;
  attempts: number;
  created_at: string;
  resolved_at: string | null;
}

export interface Ga4Session {
  id: number;
  date: string;
  sessions: number;
  source: string;
  medium: string;
  campaign: string;
  utm_track: string | null;
  utm_clip: string | null;
  utm_account: string | null;
  created_at: string;
}

export interface StanOrder {
  id: number;
  order_id: string;
  product_id: string;
  track_id: number | null;
  amount_cents: number;
  utm_track: string | null;
  utm_clip: string | null;
  utm_account: string | null;
  raw: Record<string, unknown>;
  received_at: string;
}

export interface TrackPerformance {
  track_slug: TrackSlug;
  track_name: string;
  current_week: WeekMetrics;
  previous_week: WeekMetrics;
}

export interface WeekMetrics {
  sessions: number;
  orders: number;
  revenue_cents: number;
  conversion_rate: number;
  top_clips: TopClip[];
}

export interface TopClip {
  clip_id: number;
  sessions: number;
  orders: number;
}
