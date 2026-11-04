"use client";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { products, formatPrice } from "@/data/store";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { items, isOpen, setOpen, update, remove } = useCart();
  if (!isOpen) return null;
  const rows = items.map((item) => ({ item, product: products.find((p) => p.id === item.productId)! })).filter((r) => r.product);
  const subtotal = rows.reduce((sum, row) => sum + row.product.price * row.item.quantity, 0);
  return <div className="cart-backdrop" onClick={() => setOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Shopping cart"><header><div><ShoppingBag /><h2>Your bag</h2></div><button className="icon-btn" onClick={() => setOpen(false)}><X /></button></header>
    <div className="shipping-progress"><span>{subtotal >= 3000 ? "You unlocked free delivery" : `${formatPrice(3000 - subtotal)} away from free delivery`}</span><i><b style={{ width: `${Math.min(100, subtotal / 30)}%` }} /></i></div>
    <div className="cart-lines">{rows.length ? rows.map(({ item, product }) => <article key={`${item.productId}-${item.size}`}><img src={product.image} alt={product.alt} /><div><strong>{product.name}</strong><small>{item.colour} · {item.size}</small><span>{formatPrice(product.price)}</span><div className="quantity"><button onClick={() => update(item.productId, item.quantity - 1, item.size)}><Minus /></button><b>{item.quantity}</b><button onClick={() => update(item.productId, item.quantity + 1, item.size)}><Plus /></button></div></div><button className="trash" onClick={() => remove(item.productId, item.size)}><Trash2 /></button></article>) : <div className="empty-state"><ShoppingBag /><h3>Your bag is empty</h3><Link href="/shop" onClick={() => setOpen(false)}>Explore the collection</Link></div>}</div>
    {rows.length > 0 && <footer><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><Link href="/checkout" onClick={() => setOpen(false)}>Checkout securely →</Link><Link className="view-cart" href="/cart" onClick={() => setOpen(false)}>View bag</Link></footer>}
  </aside></div>;
}
