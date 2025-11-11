export type AnalyticsEvent =
  | { type: "research:create"; payload: { jobId: string } }
  | { type: "research:export"; payload: { jobId: string; format: "md" | "pdf" } }
  | { type: "video:create"; payload: { jobId: string } }
  | { type: "video:export"; payload: { jobId: string; format: "json" | "srt" | "edl" | "clips" } }
  | { type: "video:segment:update"; payload: { jobId: string; segmentId: string } };

export function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("analytics", event);
  }
  // Integrate with analytics provider here.
}
