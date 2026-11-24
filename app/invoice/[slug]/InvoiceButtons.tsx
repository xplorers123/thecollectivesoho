"use client";

import { useState } from "react";

const CARD_SURCHARGE = 0.03;
const BANK_FEE_CENTS = 500;

function fmt(cents: number) {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function InvoiceButtons({ slug, amountCents, agreementUrl, noCardSurcharge }: { slug: string; amountCents: number; agreementUrl?: string; noCardSurcharge?: boolean }) {
  const [loading, setLoading] = useState<"card" | "bank" | null>(null);
  const [zelleOpen, setZelleOpen] = useState(false);
  const [agreed, setAgreed] = useState(!agreementUrl);
  const [shake, setShake] = useState(false);

  function requireAgreement() {
    if (!agreed) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return false;
    }
    return true;
  }

  const cardTotal = noCardSurcharge ? amountCents : Math.round(amountCents * (1 + CARD_SURCHARGE));
  const bankTotal = amountCents + BANK_FEE_CENTS;

  async function pay(method: "card" | "bank") {
    if (!requireAgreement()) return;
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
        <label
          className={`flex items-start gap-3 cursor-pointer mb-1 rounded px-2 py-1.5 transition-colors ${
            shake ? "bg-red-50 outline outline-2 outline-red-400" : ""
          }`}
          style={shake ? { animation: "shake 0.4s ease" } : {}}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => { setAgreed(e.target.checked); setShake(false); }}
            className={`mt-0.5 h-4 w-4 shrink-0 accent-black ${shake ? "outline outline-2 outline-red-500 rounded-sm" : ""}`}
          />
          <span className={`text-xs leading-relaxed ${shake ? "text-red-600 font-medium" : "text-muted"}`}>
            By submitting payment I agree to the{" "}
            <a href={agreementUrl} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-2 ${shake ? "text-red-700" : "text-black"}`}>
              Vendor Space Agreement
            </a>
            {shake && <span className="ml-1">— please check this box to continue</span>}
          </span>
          <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}`}</style>
        </label>
      )}

      {/* Credit card */}
      <button
        onClick={() => pay("card")}
        disabled={!!loading}
        className="w-full bg-black text-white px-6 py-4 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
      >
        {loading === "card" ? "Redirecting…" : (
          <span className="flex justify-between items-center">
            <span>Pay by Card</span>
            <span>{fmt(cardTotal)}{!noCardSurcharge && <span className="opacity-60"> (+3% surcharge)</span>}</span>
          </span>
        )}
      </button>

      {/* Bank transfer */}
      <button
        onClick={() => pay("bank")}
        disabled={!!loading}
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
        onClick={() => { if (!requireAgreement()) return; setZelleOpen((o) => !o); }}
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
