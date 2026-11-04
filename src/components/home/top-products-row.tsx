"use client";

import Link from "next/link";
import type { WheelEvent } from "react";
import type { Product } from "@/types/store";

export function TopProductsRow({ products }: { products: Product[] }) {
  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const row = event.currentTarget;
    const maxScroll = row.scrollWidth - row.clientWidth;
    if (maxScroll <= 1) return;

    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    const reachedStart = row.scrollLeft <= 1 && delta < 0;
    const reachedEnd = row.scrollLeft >= maxScroll - 1 && delta > 0;
    if (reachedStart || reachedEnd) return;

    event.preventDefault();
    row.scrollBy({ left: delta, behavior: "auto" });
  }

  return <div className="top-row" onWheel={handleWheel} tabIndex={0} aria-label="Top products. Scroll horizontally to browse.">{products.map((product) => <Link href={`/products/${product.slug}`} key={product.id}><img src={product.image} alt={product.alt} /><span>{product.name}</span></Link>)}</div>;
}
