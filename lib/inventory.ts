// OOS for an entire booking type + category (all dates)
const TYPE_CATEGORY_OOS = new Set([
  "weekend:jewelry",
]);

// OOS for a specific slot + category keyed as "type:startDate:category"
const SLOT_CATEGORY_OOS = new Set([
  "monthly:2026-06-01:jewelry",
  "monthly:2026-07-01:jewelry",
  // Weekly jewelry sold out through Aug 2
  "weekly:2026-07-11:jewelry", // Sat-start Jul 11–17
  "weekly:2026-07-13:jewelry", // Mon-start Jul 13–19
  "weekly:2026-07-18:jewelry", // Sat-start Jul 18–24
  "weekly:2026-07-20:jewelry", // Mon-start Jul 20–26
  "weekly:2026-07-25:jewelry", // Sat-start Jul 25–31
  "weekly:2026-07-27:jewelry", // Mon-start Jul 27–Aug 2
  "weekly:2026-08-01:jewelry", // Sat-start Aug 1–7
]);

const ALL_CATEGORIES = ["jewelry", "clothing", "other", "food-drink"];

export function getOOSCategories(type: string, startDate: string): string[] {
  return ALL_CATEGORIES.filter((cat) =>
    TYPE_CATEGORY_OOS.has(`${type}:${cat}`) ||
    SLOT_CATEGORY_OOS.has(`${type}:${startDate}:${cat}`)
  );
}
