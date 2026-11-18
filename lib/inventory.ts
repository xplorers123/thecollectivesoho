// OOS for an entire booking type + category (all dates)
const TYPE_CATEGORY_OOS = new Set<string>([]);

// OOS for a specific slot + category keyed as "type:startDate:category"
const SLOT_CATEGORY_OOS = new Set<string>([]);

const ALL_CATEGORIES = ["jewelry", "clothing", "other", "food-drink"];

export function getOOSCategories(type: string, startDate: string): string[] {
  return ALL_CATEGORIES.filter((cat) =>
    TYPE_CATEGORY_OOS.has(`${type}:${cat}`) ||
    SLOT_CATEGORY_OOS.has(`${type}:${startDate}:${cat}`)
  );
}
