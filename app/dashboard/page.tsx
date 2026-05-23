import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata = { title: "Dashboard — The Collective SoHo" };

export default async function Dashboard() {
  const { userId } = await auth();

  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("vendor_clerk_id", userId)
    .neq("status", "cancelled")
    .order("start_date", { ascending: true });

  const upcoming = bookings?.filter((b) => new Date(b.end_date) >= new Date()) ?? [];
  const past = bookings?.filter((b) => new Date(b.end_date) < new Date()) ?? [];

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }

  function statusBadge(status: string) {
    if (status === "confirmed") return "bg-green-50 text-green-700";
    if (status === "pending") return "bg-yellow-50 text-yellow-700";
    return "bg-neutral-100 text-neutral-500";
  }

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-medium">Your Bookings</h1>
        <Link
          href="/dashboard/book"
          className="bg-black px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
        >
          + Book a Booth
        </Link>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-muted text-sm">You have no bookings yet.</p>
          <Link
            href="/dashboard/book"
            className="mt-6 inline-flex items-center justify-center border border-black px-8 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Book Your First Slot
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-muted">Upcoming</p>
              <div className="space-y-3">
                {upcoming.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border border-border bg-white p-5">
                    <div>
                      <p className="text-sm font-medium capitalize">{b.booking_type} Booking</p>
                      <p className="mt-1 text-xs text-muted">
                        {formatDate(b.start_date)} – {formatDate(b.end_date)}
                      </p>
                      {b.category && (
                        <p className="mt-1 text-xs text-muted capitalize">
                          {b.category === "other" ? "All Other Categories" : b.category === "clothing" ? "Clothing / Accessories" : b.category.charAt(0).toUpperCase() + b.category.slice(1)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-medium">${(b.price_cents / 100).toLocaleString()}</p>
                      <span className={`px-2 py-1 text-xs uppercase tracking-widest ${statusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-muted">Past</p>
              <div className="space-y-3 opacity-60">
                {past.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border border-border bg-white p-5">
                    <div>
                      <p className="text-sm font-medium capitalize">{b.booking_type} Booking</p>
                      <p className="mt-1 text-xs text-muted">
                        {formatDate(b.start_date)} – {formatDate(b.end_date)}
                      </p>
                    </div>
                    <p className="text-sm">${(b.price_cents / 100).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vendor Guide */}
      <div className="mt-16 border border-border bg-neutral-50 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Vendor Guide</p>
          <p className="mt-1 text-xs text-muted">Hours, rules, display requirements, and everything you need for your booth.</p>
        </div>
        <Link
          href="/dashboard/vendor-guide"
          className="shrink-0 border border-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center"
        >
          Read the Guide
        </Link>
      </div>

      {/* Help */}
      <div className="mt-4 border border-border bg-black p-8 text-white text-center">
        <p className="text-sm font-medium">Need help?</p>
        <p className="mt-1 text-xs text-white/60">Contact our team</p>
        <a
          href="mailto:info@popupcollectivenyc.com"
          className="mt-3 inline-block text-xs uppercase tracking-widest underline underline-offset-2 hover:text-white/70 transition-colors"
        >
          info@popupcollectivenyc.com
        </a>
      </div>
    </div>
  );
}
