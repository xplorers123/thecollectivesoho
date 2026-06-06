"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string; // unique: type+startDate
  type: string;
  startDate: string;
  endDate: string;
  label: string;
  price: number;
  category: string;
  prime: boolean;
};

type CartContext = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  count: number;
};

const CartContext = createContext<CartContext>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  count: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("booking-cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  function save(next: CartItem[]) {
    setItems(next);
    localStorage.setItem("booking-cart", JSON.stringify(next));
  }

  function addItem(item: CartItem) {
    setItems((prev) => {
      // Replace if same slot already in cart
      const filtered = prev.filter((i) => i.id !== item.id);
      const next = [...filtered, item];
      localStorage.setItem("booking-cart", JSON.stringify(next));
      return next;
    });
  }

  function removeItem(id: string) {
    save(items.filter((i) => i.id !== id));
  }

  function clearCart() {
    save([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, count: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
