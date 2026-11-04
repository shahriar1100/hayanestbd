"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/types/store";

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => Array.from(new Set([product.image, ...product.gallery])), [product]);
  const [active, setActive] = useState(0);
  const move = (direction: number) => setActive((current) => (current + direction + images.length) % images.length);

  return <section className="product-gallery" aria-label={`${product.name} photos`}>
    <div className="product-gallery-stage">
      <img src={images[active]} alt={`${product.name} view ${active + 1}`} />
      {images.length > 1 && <div className="gallery-counter"><button type="button" onClick={() => move(-1)} aria-label="Previous photo"><ChevronLeft /></button><span>{active + 1} / {images.length}</span><button type="button" onClick={() => move(1)} aria-label="Next photo"><ChevronRight /></button></div>}
    </div>
    <div className="product-thumbnails">{images.map((image, index) => <button type="button" className={active === index ? "active" : ""} onClick={() => setActive(index)} aria-label={`Show photo ${index + 1}`} aria-pressed={active === index} key={`${image}-${index}`}><img src={image} alt="" /></button>)}</div>
  </section>;
}
