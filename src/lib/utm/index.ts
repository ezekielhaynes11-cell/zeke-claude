export interface UtmParams {
  trackSlug: string;
  clipId: number;
  accountId: number;
  platform: string;
  offerUrl: string;
}

export function buildUtmLink(params: UtmParams): string {
  const base = params.offerUrl.includes("?")
    ? params.offerUrl
    : params.offerUrl;

  const url = new URL(base);
  url.searchParams.set("utm_source", params.platform);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", params.trackSlug);
  url.searchParams.set("utm_content", String(params.clipId));
  url.searchParams.set("utm_term", String(params.accountId));

  return url.toString();
}

export function parseUtmFromCampaign(campaign: string, content: string, term: string) {
  return {
    utm_track: campaign || null,
    utm_clip: content || null,
    utm_account: term || null,
  };
}
