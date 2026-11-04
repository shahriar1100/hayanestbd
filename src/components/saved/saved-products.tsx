"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { useSaved } from "@/components/saved/saved-provider";
import type { Product } from "@/types/store";

export function SavedProducts({ products }: { products: Product[] }) {
  const { savedIds, hydrated, clear } = useSaved();
  const savedProducts = products.filter((product) => savedIds.includes(product.id));

  if (!hydrated) return <div className="empty-state saved-loading" aria-live="polite"><p>Loading your saved products...</p></div>;

  if (!savedProducts.length) return <div className="empty-state saved-empty"><Heart /><h2>No saved products yet</h2><p>Tap the heart on a product to keep it here for later.</p><Link href="/shop">Explore the collection</Link></div>;

  return <section aria-labelledby="saved-products-title">
    <div className="saved-toolbar"><div><h2 id="saved-products-title">Your favourites</h2><p>{savedProducts.length} {savedProducts.length === 1 ? "product" : "products"} saved on this device</p></div><button type="button" onClick={() => { if (window.confirm("Remove all saved products?")) clear(); }}>Clear all</button></div>
    <div className="product-grid saved-grid">{savedProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div>
  </section>;
}
