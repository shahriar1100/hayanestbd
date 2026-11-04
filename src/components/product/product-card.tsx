"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useSaved } from "@/components/saved/saved-provider";
import { formatPrice } from "@/data/store";
import type { Product } from "@/types/store";

export function ProductCard({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(product.id);
  function addToCart(open: boolean) { add({ productId: product.id, quantity: 1, size: product.sizes[0], colour: product.colour }); if (open) setOpen(true); }
  return <article className="product-card"><div className="product-media"><Link href={`/products/${product.slug}`}><img src={product.image} alt={product.alt} loading="lazy" /></Link>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`save-product ${saved ? "is-saved" : ""}`} onClick={() => toggle(product.id)} aria-label={saved ? `Remove ${product.name} from saved products` : `Save ${product.name}`} aria-pressed={saved}><Heart size={15} fill={saved ? "currentColor" : "none"} /></button></div><div className="product-copy"><div className="product-title-row"><h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3><strong>{formatPrice(product.price)}</strong></div><p>{product.fabric} · {product.colour} · ★ {product.rating}</p>{product.originalPrice && <span className="old-price">{formatPrice(product.originalPrice)}</span>}<div className="card-actions"><button onClick={() => addToCart(true)}>Add to Cart</button><button className="buy-btn" onClick={() => addToCart(true)}>Buy Now <span>→</span></button></div></div></article>;
}
