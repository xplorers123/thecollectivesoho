import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export const metadata = { title: "Calendar — Admin" };

const CATEGORY_STYLE: Record<string, string> = {
  clothing:  "bg-blue-100 text-blue-800 border border-blue-200",
  jewelry:   "bg-amber-100 text-amber-800 border border-amber-200",
  vintage:   "bg-purple-100 text-purple-800 border border-purple-200",
  other:     "bg-emerald-100 text-emerald-800 border border-emerald-200",
};

const CATEGORY_DOT: Record<string, string> = {
  clothing:  "bg-blue-500",
  jewelry:   "bg-amber-500",
  vintage:   "bg-purple-500",
  other:     "bg-emerald-500",
};

const DEFAULT_STYLE = "bg-gray-100 text-gray-700 border border-gray-200";
const DEFAULT_DOT   = "bg-gray-400";

function isoToDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dateToISO(d: Date) {
  return d.toISOString().split("T")[0];
}

type Booking = {
  id: string;
  brand_name: string;
  booking_type: string;
  start_date: string;
  end_date: string;
  category: string | null;
  price_cents: number;
  vendor_email: string;
};

function buildDayMap(bookings: Booking[], year: number, month: number) {
  const map: Record<string, Booking[]> = {};
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);

  for (const b of bookings) {
    const start = isoToDate(b.start_date);
    const end   = isoToDate(b.end_date);
    const cur   = new Date(Math.max(start.getTime(), first.getTime()));
    const stop  = new Date(Math.min(end.getTime(),   last.getTime()));

    while (cur <= stop) {
      const key = dateToISO(cur);
      if (!map[key]) map[key] = [];
      // only show the chip on the first day of the booking (or first day of month for monthly)
      if (dateToISO(cur) === b.start_date || (start < first && dateToISO(cur) === dateToISO(first))) {
        map[key].push(b);
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
  let year  = today.getFullYear();
  let monthIdx = today.getMonth();

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    year = y;
    monthIdx = m - 1;
  }

  const prevDate = new Date(year, monthIdx - 1, 1);
  const nextDate = new Date(year, monthIdx + 1, 1);
  const prevParam = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const nextParam = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;

  const monthLabel = new Date(year, monthIdx, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Fetch bookings that overlap this month
  const firstDay = `${year}-${String(monthIdx + 1).padStart(2, "0")}-01`;
  const lastDay  = dateToISO(new Date(year, monthIdx + 1, 0));

  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .lte("start_date", lastDay)
    .gte("end_date", firstDay)
    .eq("status", "confirmed");

  const dayMap = buildDayMap(bookings ?? [], year, monthIdx);

  // Build calendar grid
  const firstOfMonth = new Date(year, monthIdx, 1);
  const startPad = firstOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const categories = ["clothing", "jewelry", "vintage", "other"];

  return (
    <div className="px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">{monthLabel}</h1>
        <div className="flex items-center gap-3">
          <Link href={`/admin/calendar?month=${prevParam}`} className="px-4 py-2 text-xs uppercase tracking-widest border border-border hover:bg-neutral-50 transition-colors">←</Link>
          <Link href={`/admin/calendar?month=${nextParam}`} className="px-4 py-2 text-xs uppercase tracking-widest border border-border hover:bg-neutral-50 transition-colors">→</Link>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_DOT[cat] ?? DEFAULT_DOT}`} />
            <span className="text-xs capitalize text-muted">{cat}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-white border border-border rounded-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="px-3 py-2 text-xs uppercase tracking-widest text-muted text-center font-medium">{d}</div>
          ))}
        </div>

        {/* Weeks */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const iso = day ? `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
            const dayBookings = iso ? (dayMap[iso] ?? []) : [];
            const isToday = iso === dateToISO(today);
            const isWeekend = i % 7 === 0 || i % 7 === 6;

            return (
              <div
                key={i}
                className={`min-h-[100px] border-b border-r border-border p-2 ${!day ? "bg-neutral-50" : isWeekend ? "bg-stone-50/50" : "bg-white"}`}
              >
                {day && (
                  <>
                    <p className={`text-xs font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-black text-white" : "text-gray-500"}`}>
                      {day}
                    </p>
                    <div className="flex flex-col gap-1">
                      {dayBookings.map((b) => {
                        const cat = (b.category ?? "other").toLowerCase();
                        const style = CATEGORY_STYLE[cat] ?? DEFAULT_STYLE;
                        return (
                          <div key={b.id} className={`text-[11px] leading-tight px-1.5 py-1 rounded-sm ${style}`}>
                            <p className="font-semibold truncate">{b.brand_name}</p>
                            <p className="opacity-70 capitalize">{b.booking_type}</p>
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

      {/* Bookings list below */}
      {(bookings ?? []).length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm uppercase tracking-widest text-muted mb-4">This month</h2>
          <div className="grid gap-3">
            {(bookings ?? [])
              .sort((a, b) => a.start_date.localeCompare(b.start_date))
              .map((b) => {
                const cat = (b.category ?? "other").toLowerCase();
                const dot = CATEGORY_DOT[cat] ?? DEFAULT_DOT;
                return (
                  <div key={b.id} className="bg-white border border-border rounded-sm px-5 py-4 flex items-center gap-4">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{b.brand_name}</p>
                      <p className="text-xs text-muted capitalize">{b.booking_type} · {b.category ?? "other"}</p>
                    </div>
                    <p className="text-sm text-right whitespace-nowrap">
                      {isoToDate(b.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" – "}
                      {isoToDate(b.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-sm font-medium text-right w-20">${(b.price_cents / 100).toLocaleString()}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
