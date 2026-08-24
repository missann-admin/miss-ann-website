/** Minimum milliseconds a human plausibly needs between page load and submit. */
export const MIN_TIME_ON_PAGE_MS = 3000;

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Returns true when the submission looks automated: the hidden honeypot field
 * was filled, or the form was submitted implausibly fast. Callers should show
 * the normal success message without writing anything.
 */
export function looksLikeSpam(honeypot: string, mountedAt: number): boolean {
  return honeypot.trim() !== "" || Date.now() - mountedAt < MIN_TIME_ON_PAGE_MS;
}

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };
