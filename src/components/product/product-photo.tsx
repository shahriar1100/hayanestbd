import type { Product } from "@/types/store";
export function ProductPhoto({ product, className = "" }: { product: Product; className?: string }) { return <img className={className} src={product.image} alt={product.alt} loading="lazy" />; }
