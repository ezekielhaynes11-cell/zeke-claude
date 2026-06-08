// Generic captioning API adapter — configure via CAPTION_API_URL + CAPTION_API_KEY.
// The API must accept a video URL and return a captioned video URL.
// Adjust the request/response shape to match your chosen provider.

const API_URL = () => process.env.CAPTION_API_URL ?? "";
const API_KEY = () => process.env.CAPTION_API_KEY ?? "";

interface CaptionRequest {
  video_url: string;
  style?: "bottom-thirds" | "centered";
  language?: string;
}

interface CaptionJobResponse {
  job_id: string;
  status: "queued" | "processing" | "complete" | "failed";
  output_url?: string;
  error?: string;
}

async function captionRequest<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(`${API_URL()}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${API_KEY()}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Captioning API ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitCaptionJob(videoUrl: string): Promise<string> {
  const payload: CaptionRequest = {
    video_url: videoUrl,
    style: "bottom-thirds",
    language: "en",
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await captionRequest<CaptionJobResponse>("POST", "/jobs", payload);
      return result.job_id;
    } catch (err) {
      lastError = err as Error;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw lastError!;
}

export async function pollCaptionJob(jobId: string): Promise<{
  done: boolean;
  outputUrl?: string;
  error?: string;
}> {
  const result = await captionRequest<CaptionJobResponse>("GET", `/jobs/${jobId}`);
  if (result.status === "complete") {
    return { done: true, outputUrl: result.output_url };
  }
  if (result.status === "failed") {
    return { done: true, error: result.error ?? "Captioning failed" };
  }
  return { done: false };
}
