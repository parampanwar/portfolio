export function trackEvent(
  type: "blog_view" | "blog_time" | "resume_download",
  data: Record<string, any>
) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({ type, ...data });

  try {
    // For time tracking, use sendBeacon for reliability on unload/visibilitychange
    if (type === "blog_time" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/analytics",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (error) {
    console.error("Analytics tracking failed:", error);
  }
}
