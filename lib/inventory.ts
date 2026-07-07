// OOS for an entire booking type + category (all dates)
const TYPE_CATEGORY_OOS = new Set([
  "weekend:jewelry",
]);

// OOS for a specific slot + category keyed as "type:startDate:category"
const SLOT_CATEGORY_OOS = new Set([
  "monthly:2026-06-01:jewelry",
  "monthly:2026-07-01:jewelry",
  // Weekly jewelry sold out through July 17
  "weekly:2026-07-11:jewelry", // Sat-start Jul 11–17
  "weekly:2026-07-13:jewelry", // Mon-start Jul 13–19
]);

const ALL_CATEGORIES = ["jewelry", "clothing", "other", "food-drink"];

export function getOOSCategories(type: string, startDate: string): string[] {
  return ALL_CATEGORIES.filter((cat) =>
    TYPE_CATEGORY_OOS.has(`${type}:${cat}`) ||
    SLOT_CATEGORY_OOS.has(`${type}:${startDate}:${cat}`)
  );
}
