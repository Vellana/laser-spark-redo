// Summer Sale active window: June 7, 2026 through end of June 20, 2026 (America/New_York).
// Returns true while the promo is live; false after it ends so all UI auto-hides.
export const SUMMER_SALE_END = new Date("2026-06-21T04:00:00Z"); // 12:00 AM ET June 21
export const SUMMER_SALE_LABEL = "Valid June 7–20, 2026";

export const isSummerSaleActive = (now: Date = new Date()): boolean =>
  now.getTime() < SUMMER_SALE_END.getTime();
