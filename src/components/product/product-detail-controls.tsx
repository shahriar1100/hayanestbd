"use client";

import { ArrowUpRight, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { useSaved } from "@/components/saved/saved-provider";
import { SizeModal } from "./size-modal";
import type { Product } from "@/types/store";

const colourHex: Record<string, string> = { Rose: "#c98587", "Dusty rose": "#bf8287", Ivory: "#f2eee5", White: "#f8f8f4", Mocha: "#765345", Black: "#171717", Mauve: "#9b7a83", Burgundy: "#762437", Olive: "#6d7047", Champagne: "#d6c1a9", Pearl: "#e2ddd4", Latte: "#b7987c", "Neutral edit": "#b5a28c" };

export function ProductDetailControls({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [colour, setColour] = useState(product.colour);
  const { add, setOpen } = useCart();
  const { isSaved, toggle } = useSaved();
  const router = useRouter();
  const saved = isSaved(product.id);
  const colours = Array.from(new Set([product.colour, "Ivory", "Mocha", "Black", "Mauve", "Burgundy"])).slice(0, 6);

  function addItem(openCart: boolean) {
    add({ productId: product.id, quantity: qty, size, colour });
    if (openCart) setOpen(true);
  }

  function buyNow() {
    addItem(false);
    router.push("/checkout");
  }

  return <div className="detail-controls">
    <button type="button" className={`detail-save ${saved ? "is-saved" : ""}`} onClick={() => toggle(product.id)} aria-pressed={saved}><Heart fill={saved ? "currentColor" : "none"} />{saved ? "Saved for later" : "Save for later"}</button>

    <fieldset className="colour-picker"><legend>Colour <b>{colour}</b></legend><div>{colours.map((item) => <button type="button" className={colour === item ? "selected" : ""} onClick={() => setColour(item)} aria-pressed={colour === item} key={item}><i style={{ background: colourHex[item] || "#a58f82" }} />{item}</button>)}</div></fieldset>

    <div className="detail-specs"><span><small>Fabric</small><b>{product.fabric}</b></span><span><small>Size</small><button type="button" onClick={() => setGuide(true)}>{size === "Standard" ? "180 × 70 cm" : size}</button></span></div>

    <div className="size-choice"><div className="option-head"><strong>Select size</strong><button type="button" onClick={() => setGuide(true)}>Size guide</button></div><div className="size-options">{product.sizes.map((item) => <button type="button" className={size === item ? "selected" : ""} onClick={() => setSize(item)} aria-pressed={size === item} key={item}>{item}</button>)}</div></div>

    <p className="stock-note"><i /> {product.stock <= 10 ? `In stock · ${product.stock} available` : "In stock · ready to dispatch"}</p>
    <small className="variation-note">Size and availability shown are demo details.</small>

    <div className="purchase-row"><div className="quantity-control" aria-label="Quantity"><button type="button" onClick={() => setQty((current) => Math.max(1, current - 1))} aria-label="Decrease quantity"><Minus /></button><b>{qty}</b><button type="button" onClick={() => setQty((current) => Math.min(Math.min(10, product.stock), current + 1))} aria-label="Increase quantity"><Plus /></button></div><button type="button" className="add-bag" onClick={() => addItem(true)}><ShoppingBag /> Add to Bag</button><button type="button" className="buy-now" onClick={buyNow}>Buy Now <ArrowUpRight /></button></div>
    <p className="delivery-note">Nationwide delivery available across Bangladesh.</p>
    <SizeModal open={guide} onClose={() => setGuide(false)} />
  </div>;
}
