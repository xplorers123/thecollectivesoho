"use client";

import { useState } from "react";

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
  additional_comments: string;
  status: string;
  created_at: string;
  _productUrls: string[];
  _displayUrls: string[];
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:  "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-1 text-xs uppercase tracking-widest border ${styles[status] ?? "bg-neutral-100 text-neutral-500 border-neutral-200"}`}>
      {status}
    </span>
  );
}

export default function ApplicationRow({ app }: { app: Application }) {
  const [open, setOpen]         = useState(false);
  const [approving, setApproving] = useState(false);
  const [status, setStatus]     = useState(app.status ?? "pending");
  const [error, setError]       = useState("");

  async function approve() {
    if (!confirm(`Approve ${app.first_name} — ${app.brand_name}? This will send them a welcome email.`)) return;
    setApproving(true);
    setError("");
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:    app.email,
        name:     `${app.first_name} ${app.last_name}`.trim(),
        brand:    app.brand_name,
        category: app.product_category,
      }),
    });
    if (res.ok) {
      setStatus("approved");
    } else {
      const d = await res.json();
      setError(d.error ?? "Something went wrong.");
    }
    setApproving(false);
  }

  return (
    <div className="border border-border bg-white">
      {/* Collapsed row */}
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">
            {app.first_name} {app.last_name}
            {app.brand_name && <span className="ml-2 text-muted font-normal">— {app.brand_name}</span>}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {app.email} · {app.product_category} · {app.booking_type || "—"}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={status} />
          <p className="text-xs text-muted hidden sm:block">
            {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>

          {/* Details toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs uppercase tracking-widest border border-border px-3 py-1.5 hover:bg-neutral-50 transition-colors"
          >
            {open ? "Hide" : "Details"}
          </button>

          {/* Approve button */}
          {status === "pending" && (
            <button
              onClick={approve}
              disabled={approving}
              className="text-xs uppercase tracking-widest px-3 py-1.5 bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {approving ? "Approving…" : "Approve"}
            </button>
          )}
          {status === "approved" && (
            <span className="text-xs text-green-700 uppercase tracking-widest">✓ Approved</span>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {open && (
        <div className="border-t border-border px-6 py-5 bg-neutral-50 space-y-5">
          {/* Contact & brand info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm">
            {[
              ["Phone",        app.phone],
              ["Instagram",    app.instagram],
              ["Website",      app.website],
              ["Price Range",  app.price_range],
              ["Booking Type", app.booking_type],
              ["Category",     app.product_category],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          </div>

          {app.brand_story && (
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Brand Story</p>
              <p className="text-sm leading-relaxed">{app.brand_story}</p>
            </div>
          )}

          {app.additional_comments && (
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-1">Comments</p>
              <p className="text-sm leading-relaxed">{app.additional_comments}</p>
            </div>
          )}

          {/* Photos */}
          {app._productUrls.length > 0 && (
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Product Photos</p>
              <div className="flex flex-wrap gap-2">
                {app._productUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block border border-border hover:border-black transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" width={96} height={96} className="w-24 h-24 object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {app._displayUrls.length > 0 && (
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Display Photos</p>
              <div className="flex flex-wrap gap-2">
                {app._displayUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block border border-border hover:border-black transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" width={96} height={96} className="w-24 h-24 object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
