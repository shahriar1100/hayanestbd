import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageSquare, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductDetailControls } from "@/components/product/product-detail-controls";
import { ProductGallery } from "@/components/product/product-gallery";
import { formatPrice, products } from "@/data/store";

export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return product ? { title: `${product.name} | Haya Nest`, description: product.description } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id).slice(0, 4);

  return <main className="shell product-page">
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight /><Link href="/shop">Shop</Link><ChevronRight /><span>{product.name}</span></nav>

    <div className="product-detail">
      <ProductGallery product={product} />
      <section className="detail-copy">
        <span className="product-kicker">HAYA NEST · EVERYDAY ELEGANCE</span>
        <h1>{product.name}</h1>
        <div className="detail-price">{formatPrice(product.price)} <small>BDT</small>{product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}</div>
        <p>{product.description} An effortless finishing touch, from quiet mornings to evenings out.</p>
        <ProductDetailControls product={product} />
        <div className="product-delivery"><Truck /><div><strong>Delivery</strong><p>Nationwide delivery across Bangladesh (1–2 days inside Dhaka, 3–5 days outside Dhaka).</p></div></div>
      </section>
    </div>

    <section className="product-reviews"><span>CUSTOMER FEEDBACK</span><h2>Verified Buyer Reviews (0)</h2><div><MessageSquare /><strong>No reviews yet for this product.</strong><p>Have you purchased this product? After your order is delivered, you can rate and review it from your account page.</p></div></section>

    <section className="related"><header><div><span>COMPLETE YOUR LOOK</span><h2>You May Also Like</h2></div><Link href="/shop">Explore more</Link></header><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
  </main>;
}
