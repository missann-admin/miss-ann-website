/**
 * Site-wide configuration. Edit values here — no component changes needed.
 */

/**
 * Public fundraising campaign URL (GoFundMe or similar). Null until a campaign
 * exists — /restore then shows ways to help instead of a donate button.
 * Setting this to a URL swaps in the donate button and embedded widget.
 */
export const GOFUNDME_URL: string | null = null;

/** YouTube videos shown on the Videos page, in display order. */
export const YOUTUBE_VIDEOS: { id: string; title: string }[] = [
  { id: "WGVO06oZQGs", title: "Colonial Beach Historical Society feature" },
  { id: "oIT6gKAX3us", title: "Miss Ann cruising the Potomac (2014)" },
];
