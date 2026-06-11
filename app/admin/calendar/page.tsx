import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export const metadata = { title: "Calendar — Admin" };

const COLORS: Record<string, { bg: string; text: string }> = {
  clothing: { bg: "#bfdbfe", text: "#1e3a8a" },
  jewelry:  { bg: "#fde68a", text: "#78350f" },
  vintage:  { bg: "#e9d5ff", text: "#581c87" },
  other:    { bg: "#a7f3d0", text: "#064e3b" },
};
const DEFAULT_COLOR = { bg: "#e5e7eb", text: "#374151" };

const LEGEND_DOTS: Record<string, string> = {
  clothing: "#3b82f6",
  jewelry:  "#f59e0b",
  vintage:  "#a855f7",
  other:    "#10b981",
};

type Booking = {
  id: string;
  brand_name: string;
  booking_type: string;
  start_date: string;
  end_date: string;
  category: string | null;
  price_cents: number;
};

type DayEntry = { booking: Booking; position: "start" | "middle" | "end" | "single" };

function dateToISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isoToDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function buildDayMap(bookings: Booking[], year: number, month: number) {
  const map: Record<string, DayEntry[]> = {};
  for (const b of bookings) {
    const start = isoToDate(b.start_date);
    const end   = isoToDate(b.end_date);
    const cur   = new Date(start);
    while (cur <= end) {
      if (cur.getFullYear() === year && cur.getMonth() === month) {
        const key = dateToISO(cur);
        if (!map[key]) map[key] = [];
        const isStart = dateToISO(cur) === b.start_date;
        const isEnd   = dateToISO(cur) === b.end_date;
        const position: DayEntry["position"] =
          isStart && isEnd ? "single" : isStart ? "start" : isEnd ? "end" : "middle";
        map[key].push({ booking: b, position });
      }
      cur.setDate(cur.getDate() + 1);
    }
  }
  return map;
}

export default async function AdminCalendar({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const today = new Date();
  let year = today.getFullYear();
  let monthIdx = today.getMonth();

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    year = y; monthIdx = m - 1;
  }

  const prevDate  = new Date(year, monthIdx - 1, 1);
  const nextDate  = new Date(year, monthIdx + 1, 1);
  const prevParam = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const nextParam = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = new Date(year, monthIdx, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = `${year}-${String(monthIdx + 1).padStart(2, "0")}-01`;
  const lastDay  = dateToISO(new Date(year, monthIdx + 1, 0));

  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .lte("start_date", lastDay)
    .gte("end_date", firstDay)
    .eq("status", "confirmed");

  const dayMap = buildDayMap(bookings ?? [], year, monthIdx);

  const firstOfMonth = new Date(year, monthIdx, 1);
  const startPad    = firstOfMonth.getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">{monthLabel}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/admin/calendar?month=${prevParam}`} className="px-4 py-2 text-xs uppercase tracking-widest border border-border hover:bg-neutral-50 transition-colors">←</Link>
          <Link href={`/admin/calendar?month=${nextParam}`} className="px-4 py-2 text-xs uppercase tracking-widest border border-border hover:bg-neutral-50 transition-colors">→</Link>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-6">
        {Object.entries(LEGEND_DOTS).map(([cat, dot]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dot }} />
            <span className="text-xs capitalize text-muted">{cat}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="border border-border rounded-sm overflow-hidden bg-white">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-neutral-50">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="py-2 text-xs uppercase tracking-widest text-muted text-center font-medium">{d}</div>
          ))}
        </div>

        {/* Week rows */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const iso = day
              ? `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : null;
            const entries: DayEntry[] = iso ? (dayMap[iso] ?? []) : [];
            const isToday   = iso === dateToISO(today);
            const isWeekend = i % 7 === 0 || i % 7 === 6;

            return (
              <div
                key={i}
                className={`min-h-[110px] border-b border-r border-border ${!day ? "bg-neutral-50" : isWeekend ? "bg-stone-50/30" : "bg-white"}`}
              >
                {day && (
                  <>
                    <div className="px-2 pt-2 pb-1">
                      <span
                        className="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full"
                        style={isToday ? { backgroundColor: "#000", color: "#fff" } : { color: "#6b7280" }}
                      >
                        {day}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {entries.map(({ booking: b, position }) => {
                        const cat   = (b.category ?? "other").toLowerCase();
                        const color = COLORS[cat] ?? DEFAULT_COLOR;
                        const isStart  = position === "start"  || position === "single";
                        const isEnd    = position === "end"    || position === "single";

                        return (
                          <div
                            key={b.id + iso}
                            style={{ backgroundColor: color.bg, color: color.text }}
                            className={`
                              text-[11px] leading-none py-1 overflow-hidden
                              ${isStart ? "ml-1 pl-1.5 rounded-l-sm" : "-ml-px pl-0"}
                              ${isEnd   ? "mr-1 rounded-r-sm"         : "-mr-px"}
                            `}
                          >
                            {isStart
                              ? <span className="font-semibold truncate block">{b.brand_name}</span>
                              : <span className="block h-3.5" />
                            }
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary list */}
      {(bookings ?? []).length > 0 && (
        <div className="mt-10">
          <h2 className="text-xs uppercase tracking-widest text-muted mb-4">This month</h2>
          <div className="grid gap-2">
            {[...(bookings ?? [])]
              .sort((a, b) => a.start_date.localeCompare(b.start_date))
              .map((b) => {
                const cat   = (b.category ?? "other").toLowerCase();
                const dot   = LEGEND_DOTS[cat] ?? "#9ca3af";
                return (
                  <div key={b.id} className="bg-white border border-border rounded-sm px-5 py-4 flex items-center gap-4">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{b.brand_name}</p>
                      <p className="text-xs text-muted capitalize">{b.booking_type} · {b.category ?? "other"}</p>
                    </div>
                    <p className="text-sm whitespace-nowrap text-muted">
                      {isoToDate(b.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" – "}
                      {isoToDate(b.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-sm font-medium w-20 text-right">${(b.price_cents / 100).toLocaleString()}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
