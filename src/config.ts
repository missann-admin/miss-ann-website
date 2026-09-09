/**
 * Site-wide configuration. Edit values here — no component changes needed.
 */

/**
 * PayPal donate link for direct donations. Null until Frank's PayPal
 * Business account and Donate button exist — /restore then shows ways to
 * help instead of a donate button. Setting this to a URL (e.g.
 * https://www.paypal.com/donate/?hosted_button_id=xxxx) adds a "Donate Now"
 * button. No nonprofit is behind this yet, so donations are NOT
 * tax-deductible — RestorationFund.tsx shows that disclosure whenever this
 * is set. If a fiscal sponsor (e.g. CBHS) is arranged later, remove the
 * disclosure and update the donate link/processor accordingly.
 */
export const DONATE_URL: string | null =
  "https://www.paypal.com/donate/?hosted_button_id=H43HA57TQDRVQ";

/**
 * Interest options on the contact form. The `value` is stored in the database
 * and used for segmentation, so avoid renaming existing values — add new ones
 * instead, or old records stop matching.
 */
export const CONTACT_INTERESTS: { value: string; label: string }[] = [
  { value: "donate", label: "Contribute to her restoration" },
  { value: "volunteer", label: "Volunteer time, skills, or trade work" },
  { value: "marketing", label: "Help with marketing or social media" },
  { value: "memories", label: "Share memories or photographs of her" },
  { value: "updates", label: "Simply keep me posted" },
];

/** YouTube videos shown on the Videos page, in display order. */
export const YOUTUBE_VIDEOS: { id: string; title: string }[] = [
  { id: "WGVO06oZQGs", title: "Colonial Beach Historical Society feature" },
  { id: "oIT6gKAX3us", title: "Miss Ann cruising the Potomac (2014)" },
];
