// OOS for an entire booking type + category (all dates)
const TYPE_CATEGORY_OOS = new Set([
  "weekend:jewelry",
]);

// OOS for a specific slot + category keyed as "type:startDate:category"
const SLOT_CATEGORY_OOS = new Set([
  "monthly:2026-06-01:jewelry",
  "weekly:2026-06-06:jewelry",
  "weekly:2026-06-13:jewelry",
  "weekly:2026-06-20:jewelry",
  "weekly:2026-06-27:jewelry",
]);

const ALL_CATEGORIES = ["jewelry", "clothing", "other"];

export function getOOSCategories(type: string, startDate: string): string[] {
  return ALL_CATEGORIES.filter(
    (cat) =>
      TYPE_CATEGORY_OOS.has(`${type}:${cat}`) ||
      SLOT_CATEGORY_OOS.has(`${type}:${startDate}:${cat}`)
  );
}
