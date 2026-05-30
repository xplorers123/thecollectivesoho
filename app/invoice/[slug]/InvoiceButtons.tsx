"use client";

import { useState } from "react";

const CARD_SURCHARGE = 0.03;

function fmt(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function InvoiceButtons({ slug, amountCents }: { slug: string; amountCents: number }) {
  const [loading, setLoading] = useState<"card" | "bank" | null>(null);

  const cardTotal = Math.round(amountCents * (1 + CARD_SURCHARGE));
  const surcharge = cardTotal - amountCents;

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
        {loading === "card" ? "Redirecting…" : (
          <span className="flex justify-between items-center">
            <span>Pay by Card</span>
            <span>{fmt(cardTotal)} <span className="opacity-60">(+{fmt(surcharge)} surcharge)</span></span>
          </span>
        )}
      </button>
      <button
        onClick={() => pay("bank")}
        disabled={!!loading}
        className="w-full border border-black px-6 py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50"
      >
        {loading === "bank" ? "Redirecting…" : (
          <span className="flex justify-between items-center">
            <span>Pay by Bank Transfer</span>
            <span>{fmt(amountCents)}</span>
          </span>
        )}
      </button>
    </div>
  );
}
