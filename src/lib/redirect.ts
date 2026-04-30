/**
 * Validate and sanitise a post-auth redirect path.
 *
 * Open-redirect protection: only allow same-origin paths starting with a single "/"
 * (and NOT "//" which is a protocol-relative URL that could redirect off-site).
 *
 * Returns the validated path, or the provided fallback if invalid.
 */
export const safeRedirect = (raw: string | null | undefined, fallback = "/dashboard"): string => {
  if (!raw || typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback; // protocol-relative URL
  if (trimmed.startsWith("/\\")) return fallback; // backslash variant
  // Reject absolute URLs disguised as paths (e.g. "/http://evil.com")
  if (/^\/(https?:|javascript:|data:|vbscript:)/i.test(trimmed)) return fallback;
  // Length guard against absurd payloads
  if (trimmed.length > 512) return fallback;
  return trimmed;
};
