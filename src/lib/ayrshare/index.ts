import type { Platform } from "@/lib/types";

const BASE_URL = "https://app.ayrshare.com/api";
const API_KEY = () => process.env.AYRSHARE_API_KEY ?? "";

const PLATFORM_MAP: Record<Platform, string> = {
  tiktok: "tiktok",
  instagram: "instagram",
  youtube: "youtube",
};

interface PostPayload {
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  profileKey?: string;
  scheduleDate?: string;
}

interface PostResult {
  id: string;
  status: string;
  postIds?: Array<{ platform: string; id: string; status: string }>;
  errors?: Array<{ platform: string; error: string }>;
}

async function ayrshareRequest<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown,
  profileKey?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${API_KEY()}`,
    "Content-Type": "application/json",
  };
  if (profileKey) {
    headers["Profile-Key"] = profileKey;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = (data as { message?: string }).message ?? `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function publishPost(params: {
  platform: Platform;
  profileKey?: string;
  postText: string;
  mediaUrl: string;
  scheduleDate?: Date;
}): Promise<{ providerPostId: string }> {
  const payload: PostPayload = {
    post: params.postText,
    platforms: [PLATFORM_MAP[params.platform]],
    mediaUrls: [params.mediaUrl],
    ...(params.profileKey ? { profileKey: params.profileKey } : {}),
    ...(params.scheduleDate ? { scheduleDate: params.scheduleDate.toISOString() } : {}),
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await ayrshareRequest<PostResult>("POST", "/post", payload, params.profileKey);
      const postId = result.id ?? result.postIds?.[0]?.id ?? "unknown";
      return { providerPostId: postId };
    } catch (err) {
      lastError = err as Error;
      // Don't retry auth failures — surface them immediately
      const msg = (err as Error).message ?? "";
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("forbidden")) {
        throw new AyrshareAuthError(msg);
      }
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  throw lastError!;
}

export async function deletePost(providerPostId: string, platform: Platform, profileKey?: string): Promise<void> {
  await ayrshareRequest(
    "DELETE",
    `/post`,
    { id: providerPostId, platforms: [PLATFORM_MAP[platform]] },
    profileKey
  );
}

export class AyrshareAuthError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "AyrshareAuthError";
  }
}
