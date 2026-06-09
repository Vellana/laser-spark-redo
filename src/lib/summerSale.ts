// Summer Sale active window: June 15, 2026 through end of June 20, 2026 (America/New_York).
// Returns true while the promo is live; false after it ends so all UI auto-hides.
export const SUMMER_SALE_START = new Date("2026-06-15T04:00:00Z"); // 12:00 AM ET June 15
export const SUMMER_SALE_END = new Date("2026-06-21T04:00:00Z");   // 12:00 AM ET June 21
export const SUMMER_SALE_LABEL = "Valid June 15–20, 2026";

export const isSummerSaleActive = (now: Date = new Date()): boolean => {
  const t = now.getTime();
  return t >= SUMMER_SALE_START.getTime() && t < SUMMER_SALE_END.getTime();
};

/** True before the sale starts (for "Coming Soon" teasers). */
export const isSummerSaleUpcoming = (now: Date = new Date()): boolean =>
  now.getTime() < SUMMER_SALE_START.getTime();
