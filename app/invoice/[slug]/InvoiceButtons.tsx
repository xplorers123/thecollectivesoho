"use client";

import { useState } from "react";

const CARD_SURCHARGE = 0.03;
const BANK_FEE_CENTS = 500;

function fmt(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function InvoiceButtons({ slug, amountCents, agreementUrl }: { slug: string; amountCents: number; agreementUrl?: string }) {
  const [loading, setLoading] = useState<"card" | "bank" | null>(null);
  const [zelleOpen, setZelleOpen] = useState(false);
  const [agreed, setAgreed] = useState(!agreementUrl);

  const cardTotal = Math.round(amountCents * (1 + CARD_SURCHARGE));
  const bankTotal = amountCents + BANK_FEE_CENTS;

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
      {/* Agreement checkbox */}
      {agreementUrl && (
        <label className="flex items-start gap-3 cursor-pointer mb-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-black"
          />
          <span className="text-xs text-muted leading-relaxed">
            By submitting payment I agree to the{" "}
            <a href={agreementUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-black">
              Consignment Agreement
            </a>
          </span>
        </label>
      )}

      {/* Credit card */}
      <button
        onClick={() => pay("card")}
        disabled={!!loading || !agreed}
        className="w-full bg-black text-white px-6 py-4 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {loading === "card" ? "Redirecting…" : (
          <span className="flex justify-between items-center">
            <span>Pay by Card</span>
            <span>{fmt(cardTotal)} <span className="opacity-60">(+3% surcharge)</span></span>
          </span>
        )}
      </button>

      {/* Bank transfer */}
      <button
        onClick={() => pay("bank")}
        disabled={!!loading || !agreed}
        className="w-full border border-black px-6 py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50"
      >
        {loading === "bank" ? "Redirecting…" : (
          <span className="flex justify-between items-center">
            <span>Pay by Bank Transfer</span>
            <span>{fmt(bankTotal)} <span className="opacity-60">(+$5 fee)</span></span>
          </span>
        )}
      </button>

      {/* Zelle */}
      <button
        onClick={() => setZelleOpen((o) => !o)}
        className="w-full border border-black px-6 py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
      >
        <span className="flex justify-between items-center">
          <span>Pay by Zelle</span>
          <span>{fmt(amountCents)} <span className="opacity-60">(no fee)</span></span>
        </span>
      </button>

      {zelleOpen && (
        <div className="border border-border p-5 text-sm space-y-2 bg-neutral-50">
          <p className="text-xs uppercase tracking-widest text-muted mb-3">Zelle Details</p>
          <div className="flex justify-between">
            <span className="text-muted">Send to</span>
            <span className="font-medium">info@popupcollectivenyc.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Name</span>
            <span className="font-medium">Xplorers LLC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Amount</span>
            <span className="font-medium">{fmt(amountCents)}</span>
          </div>
          <p className="text-xs text-muted pt-2">Include your brand name in the memo. Reply to your invoice email once sent.</p>
        </div>
      )}
    </div>
  );
}
