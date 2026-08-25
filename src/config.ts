/**
 * Site-wide configuration. Edit values here — no component changes needed.
 */

/**
 * Public fundraising campaign URL (GoFundMe or similar). Null until a campaign
 * exists — /restore then shows ways to help instead of a donate button.
 * Setting this to a URL swaps in the donate button and embedded widget.
 */
export const GOFUNDME_URL: string | null = null;

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
