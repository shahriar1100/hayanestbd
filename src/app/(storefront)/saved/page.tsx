import type { Metadata } from "next";
import { SavedProducts } from "@/components/saved/saved-products";
import { products } from "@/data/store";

export const metadata: Metadata = { title: "Saved products | Haya Nest", description: "Your saved Haya Nest products." };

export default function SavedPage() {
  return <main className="shell page-space"><div className="page-hero compact"><span>YOUR FAVOURITES</span><h1>Saved products</h1><p>Your favourite pieces stay saved on this device until you remove them.</p></div><SavedProducts products={products} /></main>;
}
