"use client";

import { useState } from "react";
import Link from "next/link";

type Category = "jewelry" | "clothing" | "other";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "jewelry", label: "Jewelry" },
  { value: "clothing", label: "Clothing / Accessories" },
  { value: "other", label: "All Other Categories" },
];

const TERMS = [
  "Please only book categories you have been approved for by The Collective SoHo team. Bookings made under unapproved categories may be cancelled.",
  "Each brand may only book one slot per time period unless otherwise approved. Please do not place multiple bookings under the same or different categories.",
  "Payment of your space assumes your acceptance of the Terms and Conditions.",
  "Bookings are non-transferable. You may not give, sell, or share your slot with another brand or artist.",
  "All bookings are final and non-refundable.",
  "The Collective SoHo reserves the right to cancel any booking that does not follow these guidelines.",
];

type Props = {
  slot: {
    id: string;
    startDate: string;
    endDate: string;
    label: string;
    price: number;
    type: string;
  };
  primePlacementPrice: number;
  originalPrice?: number;
  oosCategories?: string[];
};

export default function BookingDetail({ slot, primePlacementPrice, originalPrice, oosCategories = [] }: Props) {
  const [category, setCategory] = useState<Category | null>(null);
  const [prime, setPrime] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState<"ach" | "card" | null>(null);
  const [error, setError] = useState("");

  const totalPrice = slot.price + (prime ? primePlacementPrice : 0);
  const cardTotal = Math.round(totalPrice * 1.03);
  const cardFee = cardTotal - totalPrice;

  function formatPrice(cents: number) {
    return `$${(cents / 100).toLocaleString()}`;
  }

  async function handleBook(paymentMethod: "ach" | "card") {
    if (!category || !agreed) return;
    setError("");
    setLoading(paymentMethod);
    const price = paymentMethod === "card" ? cardTotal : totalPrice;
    try {
      const res = await fetch("/api/bookings/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...slot, price, category, prime, paymentMethod }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-widest text-muted">Your Category</p>
        <div className="space-y-3">
          {CATEGORIES.map((c) => {
            const oos = oosCategories.includes(c.value);
            return (
              <label key={c.value} className={`flex items-center gap-3 ${oos ? "cursor-not-allowed opacity-50" : "cursor-pointer group"}`}>
                <input
                  type="radio"
                  name="category"
                  value={c.value}
                  checked={category === c.value}
                  onChange={() => !oos && setCategory(c.value)}
                  disabled={oos}
                  className="accent-black"
                />
                <span className="text-sm group-hover:text-black transition-colors">{c.label}</span>
                {oos && (
                  <span className="text-xs uppercase tracking-widest text-red-500">Sold Out</span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Prime placement */}
      {primePlacementPrice > 0 && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-muted">Placement</p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prime}
              onChange={(e) => setPrime(e.target.checked)}
              className="mt-0.5 accent-black"
            />
            <div>
              <p className="text-sm font-medium">Prime Placement (+{formatPrice(primePlacementPrice)})</p>
              <p className="text-xs text-muted mt-1">High-visibility spot selected by our team based on your product category.</p>
            </div>
          </label>
        </div>
      )}

      {/* Price */}
      <div className="border-t border-border pt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Base price</span>
          <span className="flex items-center gap-2">
            {originalPrice && (
              <>
                <span className="line-through text-muted">{formatPrice(originalPrice)}</span>
                <span className="text-xs text-green-700 font-medium">
                  {Math.round((1 - slot.price / originalPrice) * 100)}% off
                </span>
              </>
            )}
            {formatPrice(slot.price)}
          </span>
        </div>
        {prime && primePlacementPrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted">Prime placement</span>
            <span>+{formatPrice(primePlacementPrice)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
          <span>Total (bank transfer)</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted">
          <span>Total (card, +3% fee)</span>
          <span>{formatPrice(cardTotal)}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="border-t border-border pt-6">
        <p className="mb-3 text-xs uppercase tracking-widest text-muted">Booking Information</p>
        <ul className="space-y-2">
          {TERMS.map((t, i) => (
            <li key={i} className="text-xs text-muted leading-relaxed flex gap-2">
              <span className="shrink-0">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <label className="mt-4 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-black"
          />
          <span className="text-xs text-muted">
            I have read and agree to the booking terms above and the{" "}
            <Link href="/terms-and-conditions" target="_blank" className="underline underline-offset-2 hover:text-black transition-colors">
              Terms &amp; Conditions
            </Link>
            .
          </span>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleBook("ach")}
          disabled={!category || !agreed || !!loading}
          className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-40"
        >
          {loading === "ach" ? "Loading…" : `Pay by Bank Transfer — ${formatPrice(totalPrice)}`}
        </button>
        <button
          type="button"
          onClick={() => handleBook("card")}
          disabled={!category || !agreed || !!loading}
          className="w-full border border-black px-6 py-4 text-xs uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors disabled:opacity-40"
        >
          {loading === "card" ? "Loading…" : `Pay by Card — ${formatPrice(cardTotal)} (+3% fee)`}
        </button>
      </div>
    </div>
  );
}
