export type Attribution = {
  form: string;
  page_path: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

/**
 * Captures where a submission came from, so campaigns can be told apart later.
 * UTM tags (?utm_source=facebook&utm_campaign=exhibit-opening) let a shared
 * link report back which posting or mailing actually brought someone in.
 */
export function captureAttribution(form: string): Attribution {
  const params = new URLSearchParams(window.location.search);
  const sameSite =
    document.referrer && document.referrer.startsWith(window.location.origin);
  return {
    form,
    page_path: window.location.pathname,
    // An internal referrer says nothing about acquisition, so drop it.
    referrer: document.referrer && !sameSite ? document.referrer : null,
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };
}
