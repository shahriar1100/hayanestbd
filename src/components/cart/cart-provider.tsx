"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/store";

type CartContextValue = {
  items: CartItem[];
  count: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (item: CartItem) => void;
  update: (productId: string, quantity: number, size?: string) => void;
  remove: (productId: string, size?: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "haya-nest-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => { try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { setItems([]); } }); return () => cancelAnimationFrame(frame); }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);
  const add = useCallback((item: CartItem) => setItems((current) => {
    const index = current.findIndex((row) => row.productId === item.productId && row.size === item.size && row.colour === item.colour);
    if (index < 0) return [...current, item];
    return current.map((row, i) => i === index ? { ...row, quantity: Math.min(10, row.quantity + item.quantity) } : row);
  }), []);
  const update = useCallback((id: string, quantity: number, size?: string) => setItems((current) => current.map((row) => row.productId === id && (!size || row.size === size) ? { ...row, quantity: Math.max(1, Math.min(10, quantity)) } : row)), []);
  const remove = useCallback((id: string, size?: string) => setItems((current) => current.filter((row) => !(row.productId === id && (!size || row.size === size)))), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((sum, row) => sum + row.quantity, 0), isOpen, setOpen, add, update, remove, clear }), [items, isOpen, add, update, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
