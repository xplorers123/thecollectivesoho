"use client";

import { useState, useMemo } from "react";
import ApplicationRow from "./ApplicationRow";

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  brand_name: string;
  product_category: string;
  instagram: string;
  website: string;
  price_range: string;
  brand_story: string;
  booking_type: string;
  setup_preference?: string;
  additional_comments: string;
  status: string;
  created_at: string;
  _productUrls: string[];
  _displayUrls: string[];
};

const BOOKING_FILTERS  = ["All", "Monthly", "Weekly", "Weekend", "Weekday"];
const STATUS_FILTERS   = ["All", "Pending", "Approved", "Rejected"];
const CATEGORY_FILTERS = ["All", "Jewelry", "Clothing & Accessories", "Beauty and Home Goods", "Food / Drink", "Vintage", "Art", "Other"];

const CANONICAL_CATEGORIES = new Set(CATEGORY_FILTERS.slice(1));

function normalizeCategory(raw: string): string {
  if (!raw) return "Other";
  const lower = raw.toLowerCase();
  if (lower.includes("jewelry")) return "Jewelry";
  if (lower.includes("clothing") || lower.includes("accessories") || lower.includes("fashion") || lower.includes("apparel")) return "Clothing & Accessories";
  if (lower.includes("beauty") || lower.includes("skincare") || lower.includes("candle") || lower.includes("cosmetic") || lower.includes("fragrance") || lower.includes("home good")) return "Beauty and Home Goods";
  if (lower.includes("food") || lower.includes("drink") || lower.includes("bakery") || lower.includes("coffee") || lower.includes("chocolate") || lower.includes("cafe") || lower.includes("pastry") || lower.includes("cupcake")) return "Food / Drink";
  if (lower.includes("vintage")) return "Vintage";
  if (lower.includes("art") || lower.includes("print") || lower.includes("painting") || lower.includes("pottery") || lower.includes("ceramic") || lower.includes("woodburn")) return "Art";
  if (CANONICAL_CATEGORIES.has(raw)) return raw;
  return "Other";
}

function matchesBooking(bookingType: string, filter: string): boolean {
  if (filter === "All") return true;
  return bookingType?.toLowerCase().includes(filter.toLowerCase()) ?? false;
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${
        active
          ? "bg-black text-white border-black"
          : "border-border text-muted hover:border-black hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

export default function ApplicationsClient({ applications }: { applications: Application[] }) {
  const [bookingFilter, setBookingFilter] = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = useMemo(() => applications.filter(app => {
    if (!matchesBooking(app.booking_type, bookingFilter)) return false;
    if (statusFilter !== "All" && app.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (categoryFilter !== "All" && normalizeCategory(app.product_category) !== categoryFilter) return false;
    return true;
  }), [applications, bookingFilter, statusFilter, categoryFilter]);

  return (
    <div className="px-8 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-medium">Applications</h1>
        <p className="text-xs text-muted">{filtered.length} of {applications.length}</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted uppercase tracking-widest w-16">Type</span>
          {BOOKING_FILTERS.map(f => (
            <FilterBtn key={f} label={f} active={bookingFilter === f} onClick={() => setBookingFilter(f)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted uppercase tracking-widest w-16">Status</span>
          {STATUS_FILTERS.map(f => (
            <FilterBtn key={f} label={f} active={statusFilter === f} onClick={() => setStatusFilter(f)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted uppercase tracking-widest w-16">Category</span>
          {CATEGORY_FILTERS.map(f => (
            <FilterBtn key={f} label={f} active={categoryFilter === f} onClick={() => setCategoryFilter(f)} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No applications match these filters.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicationRow key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
