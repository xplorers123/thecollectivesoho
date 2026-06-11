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

export default async function AdminBookings() {
  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("start_date", { ascending: false });

  const total = (bookings ?? []).reduce((s, b) => s + (b.price_cents ?? 0), 0);

  return (
    <div className="px-8 py-10 max-w-6xl">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium">Bookings</h1>
          <p className="text-sm text-muted mt-1">{bookings?.length ?? 0} confirmed · {formatAmount(total)} total</p>
        </div>
      </div>

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
            {(bookings ?? []).map((b) => (
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
            {!bookings?.length && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted text-sm">No bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
