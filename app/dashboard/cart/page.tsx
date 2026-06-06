"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { useState } from "react";

function fmt(cents: number) {
  return `$${(cents / 100).toLocaleString()}`;
}

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState<"ach" | "card" | null>(null);
  const [error, setError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const cardTotal = Math.round(subtotal * 1.03);
  const cardFee = cardTotal - subtotal;

  async function checkout(paymentMethod: "ach" | "card") {
    setLoading(paymentMethod);
    setError("");
    try {
      const price = paymentMethod === "card" ? cardTotal : subtotal;
      const res = await fetch("/api/bookings/create-cart-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, paymentMethod, totalCents: price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong.");
        setLoading(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-xs uppercase tracking-widest text-muted mb-4">Your Cart</p>
        <p className="text-2xl font-medium mb-2">Your cart is empty.</p>
        <p className="text-sm text-muted mb-8">Browse available dates and add them to your cart.</p>
        <Link
          href="/dashboard/book"
          className="inline-flex items-center justify-center bg-black px-8 py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
        >
          Book a Booth
        </Link>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-medium">Your Cart</h1>
        <Link href="/dashboard/book" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">
          + Add More
        </Link>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border border-border p-4">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted mt-0.5 capitalize">
                {item.type} · {item.category}{item.prime ? " · Prime placement" : ""}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">{fmt(item.price)}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-muted hover:text-black transition-colors uppercase tracking-widest"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-border pt-6 space-y-2 mb-8 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal ({items.length} {items.length === 1 ? "booking" : "bookings"})</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between font-medium pt-2 border-t border-border">
          <span>Total (bank transfer)</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Total (card, +3% fee)</span>
          <span>{fmt(cardTotal)}</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {/* Checkout buttons */}
      <div className="space-y-3">
        <button
          onClick={() => checkout("ach")}
          disabled={!!loading}
          className="w-full bg-black px-6 py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {loading === "ach" ? "Loading…" : `Pay by Bank Transfer — ${fmt(subtotal)}`}
        </button>
        <button
          onClick={() => checkout("card")}
          disabled={!!loading}
          className="w-full border border-black px-6 py-4 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50"
        >
          {loading === "card" ? "Loading…" : `Pay by Card — ${fmt(cardTotal)} (+3% fee)`}
        </button>
        <button
          onClick={clearCart}
          className="w-full text-xs uppercase tracking-widest text-muted hover:text-black transition-colors"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
