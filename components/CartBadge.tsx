"use client";

import { useCart } from "@/lib/cart-context";

export default function CartBadge() {
  const { count } = useCart();
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px] font-medium">
      {count}
    </span>
  );
}
