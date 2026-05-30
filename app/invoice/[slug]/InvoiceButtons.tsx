"use client";

import { useState } from "react";

export default function InvoiceButtons({ slug }: { slug: string }) {
  const [loading, setLoading] = useState<"card" | "bank" | null>(null);

  async function pay(method: "card" | "bank") {
    setLoading(method);
    try {
      const res = await fetch("/api/invoice/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, method }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => pay("card")}
        disabled={!!loading}
        className="w-full bg-black text-white px-6 py-4 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {loading === "card" ? "Redirecting…" : "Pay by Card"}
      </button>
      <button
        onClick={() => pay("bank")}
        disabled={!!loading}
        className="w-full border border-black px-6 py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50"
      >
        {loading === "bank" ? "Redirecting…" : "Pay by Bank Transfer"}
      </button>
    </div>
  );
}
