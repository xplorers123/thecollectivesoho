import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata = { title: "Bookings — Admin" };

const TYPE_COLOR: Record<string, string> = {
  weekend: "bg-blue-50 text-blue-700",
  weekly: "bg-purple-50 text-purple-700",
  monthly: "bg-green-50 text-green-700",
};

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAmount(cents: number) {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function BookingTable({ bookings }: { bookings: any[] }) {
  if (!bookings.length) return (
    <p className="px-5 py-8 text-sm text-muted text-center">None.</p>
  );
  return (
    <div className="bg-white border border-border rounded-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-neutral-50 text-xs uppercase tracking-widest text-muted">
            <th className="text-left px-5 py-3">Brand</th>
            <th className="text-left px-5 py-3">Type</th>
            <th className="text-left px-5 py-3">Dates</th>
            <th className="text-left px-5 py-3">Category</th>
            <th className="text-left px-5 py-3">Email</th>
            <th className="text-right px-5 py-3">Amount</th>
            <th className="text-left px-5 py-3">Booked</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-border last:border-0 hover:bg-neutral-50 transition-colors">
              <td className="px-5 py-4 font-medium">{b.brand_name}</td>
              <td className="px-5 py-4">
                <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${TYPE_COLOR[b.booking_type] ?? "bg-gray-100 text-gray-600"}`}>
                  {b.booking_type}
                </span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                {formatDate(b.start_date)} – {formatDate(b.end_date)}
              </td>
              <td className="px-5 py-4 capitalize">{b.category ?? "—"}</td>
              <td className="px-5 py-4 text-muted">{b.vendor_email}</td>
              <td className="px-5 py-4 text-right font-medium">{formatAmount(b.price_cents)}</td>
              <td className="px-5 py-4 text-muted whitespace-nowrap">
                {new Date(b.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminBookings() {
  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("status", "confirmed")
    .order("start_date", { ascending: false });

  const today = new Date().toISOString().split("T")[0];
  const all = bookings ?? [];
  const upcoming = all.filter((b) => b.end_date >= today);
  const past = all.filter((b) => b.end_date < today);

  const total = all.reduce((s, b) => s + (b.price_cents ?? 0), 0);
  const upcomingTotal = upcoming.reduce((s, b) => s + (b.price_cents ?? 0), 0);

  return (
    <div className="px-8 py-10 max-w-6xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium">Bookings</h1>
          <p className="text-sm text-muted mt-1">{all.length} confirmed · {formatAmount(total)} total</p>
        </div>
      </div>

      {/* Upcoming */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-xs uppercase tracking-widest font-semibold">Upcoming</h2>
          <span className="text-xs text-muted">{upcoming.length} bookings · {formatAmount(upcomingTotal)}</span>
        </div>
        <BookingTable bookings={upcoming} />
      </div>

      {/* Past */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-muted">Past</h2>
          <span className="text-xs text-muted">{past.length} bookings</span>
        </div>
        <BookingTable bookings={past} />
      </div>
    </div>
  );
}
