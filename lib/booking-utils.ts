export const AVAILABLE_BOOTHS = 5;

// Weekends that are manually sold out (Saturday start date)
export const SOLD_OUT_WEEKEND_STARTS = new Set([
  "2026-06-27",
  "2026-07-04",
  "2026-07-11",
]);

export type BookingSlot = {
  id: string;
  startDate: string; // ISO date YYYY-MM-DD
  endDate: string;
  label: string;
  price: number; // cents
  type: "weekend" | "weekly" | "monthly";
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateFull(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function toISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

function nextSaturday(from: Date): Date {
  const d = new Date(from);
  const day = d.getDay();
  const daysUntilSat = day === 6 ? 7 : (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSat);
  d.setHours(0, 0, 0, 0);
  return d;
}

const CUTOFF = new Date("2026-09-01");

export function getWeekendSlots(): BookingSlot[] {
  const slots: BookingSlot[] = [];
  let sat = nextSaturday(new Date());

  while (sat < CUTOFF) {
    const sun = new Date(sat);
    sun.setDate(sun.getDate() + 1);

    const sameMonth = sat.getMonth() === sun.getMonth();
    const label = sameMonth
      ? `${formatDate(sat)} – ${sun.getDate()}, ${sat.getFullYear()}`
      : `${formatDate(sat)} – ${formatDate(sun)}, ${sun.getFullYear()}`;

    slots.push({
      id: toISO(sat),
      startDate: toISO(sat),
      endDate: toISO(sun),
      label,
      price: 60000,
      type: "weekend",
    });

    sat = new Date(sat);
    sat.setDate(sat.getDate() + 7);
  }
  return slots;
}

export function getWeeklySlots(startDay: "saturday" | "monday" = "saturday"): BookingSlot[] {
  const slots: BookingSlot[] = [];
  let sat = nextSaturday(new Date());

  while (sat < CUTOFF) {
    const start = new Date(sat);
    if (startDay === "monday") {
      start.setDate(start.getDate() + 2); // Sat → Mon
    }
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const sameMonth = start.getMonth() === end.getMonth();
    const label = sameMonth
      ? `${formatDate(start)} – ${end.getDate()}, ${start.getFullYear()}`
      : `${formatDate(start)} – ${formatDate(end)}, ${end.getFullYear()}`;

    slots.push({
      id: toISO(start),
      startDate: toISO(start),
      endDate: toISO(end),
      label,
      price: 85000,
      type: "weekly",
    });

    sat = new Date(sat);
    sat.setDate(sat.getDate() + 7);
  }
  return slots;
}

export function getAllWeeklySlots(): BookingSlot[] {
  return [...getWeeklySlots("saturday"), ...getWeeklySlots("monday")];
}

export function getMonthlySlots(): BookingSlot[] {
  const slots: BookingSlot[] = [];
  const today = new Date();

  // Start from next month's 1st (always include the coming month)
  let year = today.getFullYear();
  let month = today.getMonth() + 1; // next month (0-indexed)

  while (true) {
    if (month > 11) {
      month = 0;
      year++;
    }
    const start = new Date(year, month, 1);
    if (start >= CUTOFF) break;

    const end = new Date(year, month + 1, 0); // last day of month
    const label = start.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    slots.push({
      id: toISO(start),
      startDate: toISO(start),
      endDate: toISO(end),
      label,
      price: 320000,
      type: "monthly",
    });

    month++;
  }
  return slots;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}
