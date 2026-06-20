// OOS for an entire booking type + category (all dates)
const TYPE_CATEGORY_OOS = new Set([
  "weekend:jewelry",
  "weekly:jewelry",
]);

// OOS for a specific slot + category keyed as "type:startDate:category"
const SLOT_CATEGORY_OOS = new Set([
  "monthly:2026-06-01:jewelry",
  "monthly:2026-07-01:jewelry",
]);

// Food & drink not available for slots starting before this date
const FOOD_DRINK_AVAILABLE_FROM = "2026-07-13";

const ALL_CATEGORIES = ["jewelry", "clothing", "other", "food-drink"];

export function getOOSCategories(type: string, startDate: string): string[] {
  return ALL_CATEGORIES.filter((cat) => {
    if (cat === "food-drink" && startDate < FOOD_DRINK_AVAILABLE_FROM) return true;
    return (
      TYPE_CATEGORY_OOS.has(`${type}:${cat}`) ||
      SLOT_CATEGORY_OOS.has(`${type}:${startDate}:${cat}`)
    );
  });
}
