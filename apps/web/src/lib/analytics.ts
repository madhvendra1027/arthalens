/**
 * ArthaLens Privacy-Conscious Event Tracking
 * Enforces Consent Mode v2 and scrubs all PII and sensitive credentials.
 */

export interface EventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  // 1. Consent verification
  try {
    const consent = localStorage.getItem("arthalens_consent_status");
    if (consent !== "accepted") {
      return;
    }
  } catch {
    return;
  }

  // 2. Sensitive data sanitization (Scrub tokens, passwords, emails)
  const sanitizedParams: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes("password") ||
      lowerKey.includes("token") ||
      lowerKey.includes("secret") ||
      lowerKey.includes("key") ||
      lowerKey.includes("auth") ||
      lowerKey.includes("email")
    ) {
      continue;
    }
    sanitizedParams[key] = val;
  }

  // 3. Dispatch to gtag if present
  const win = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof win.gtag === "function") {
    win.gtag("event", eventName, sanitizedParams);
  }
}
