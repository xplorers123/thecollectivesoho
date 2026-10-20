export const AVAILABLE_BOOTHS = 5;

export type BookingSlot = {
  id: string;
  startDate: string; // ISO date YYYY-MM-DD
  endDate: string;
  label: string;
  price: number; // cents
  type: "weekend" | "weekly" | "monthly" | "weekday";
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

const CUTOFF = new Date("2027-01-01");

const STANDARD_PRICES: Record<BookingSlot["type"], number> = {
  weekend: 60000,
  weekly: 85000,
  monthly: 320000,
  weekday: 40000,
};

// Holiday Season: slots starting Nov 1 – Dec 31
const HOLIDAY_PRICES: Record<BookingSlot["type"], number> = {
  weekend: 65000,
  weekly: 95000,
  monthly: 350000,
  weekday: 50000,
};

function isHolidaySeason(startDate: string): boolean {
  const month = Number(startDate.slice(5, 7));
  return month === 11 || month === 12;
}

export function getSlotPrice(type: BookingSlot["type"], startDate: string): number {
  return (isHolidaySeason(startDate) ? HOLIDAY_PRICES : STANDARD_PRICES)[type];
}

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
      price: getSlotPrice("weekend", toISO(sat)),
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
      price: getSlotPrice("weekly", toISO(start)),
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
      price: getSlotPrice("monthly", toISO(start)),
      type: "monthly",
    });

    month++;
  }
  return slots;
}

function nextMonday(from: Date): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const daysUntilMon = ((1 - day + 7) % 7) || 7;
  d.setDate(d.getDate() + daysUntilMon);
  return d;
}

export function getWeekdaySlots(): BookingSlot[] {
  const slots: BookingSlot[] = [];
  let mon = nextMonday(new Date());

  while (mon < CUTOFF) {
    const fri = new Date(mon);
    fri.setDate(fri.getDate() + 4);

    const sameMonth = mon.getMonth() === fri.getMonth();
    const label = sameMonth
      ? `${formatDate(mon)} – ${fri.getDate()}, ${mon.getFullYear()}`
      : `${formatDate(mon)} – ${formatDate(fri)}, ${fri.getFullYear()}`;

    slots.push({
      id: toISO(mon),
      startDate: toISO(mon),
      endDate: toISO(fri),
      label,
      price: getSlotPrice("weekday", toISO(mon)),
      type: "weekday",
    });

    mon = new Date(mon);
    mon.setDate(mon.getDate() + 7);
  }
  return slots;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

export function findSlot(type: string, startDate: string): BookingSlot | undefined {
  const slots =
    type === "weekend" ? getWeekendSlots() :
    type === "weekly"  ? getAllWeeklySlots() :
    type === "monthly" ? getMonthlySlots() :
    type === "weekday" ? getWeekdaySlots() : [];
  return slots.find((s) => s.id === startDate);
}
