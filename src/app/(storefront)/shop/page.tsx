import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { products } from "@/data/store";
export const metadata: Metadata = { title: "Shop modest fashion | Haya Nest" };
const categories = ["Hijabs", "Abayas", "Prayer Sets", "Accessories"];
export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string }> }) { const params = await searchParams; const initialCategory = categories.includes(params.category || "") ? params.category! : "All"; return <main className="shell page-space"><div className="page-hero"><span>THE HAYA COLLECTION</span><h1>Find your everyday favourite</h1><p>Refined hijabs, abayas and essentials—designed for comfort, coverage and confidence.</p></div><ShopCatalog products={products} initialCategory={initialCategory} initialSort={params.sort} /></main>; }
