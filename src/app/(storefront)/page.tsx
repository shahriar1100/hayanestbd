import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { collections, getProduct, photoUrls, products, stories } from "@/data/store";
import { ProductCard } from "@/components/product/product-card";
import { TopProductsRow } from "@/components/home/top-products-row";

export default function HomePage() {
  return <main className="shell">
    <section className="hero"><img src={photoUrls.blush} alt="Refined everyday hijab styling" /><div className="hero-shade" /><div className="hero-copy"><span>THE SIGNATURE EDIT</span><h1>Signature Modal<br />&amp; Chiffon Drapes</h1><p>Breathable, lightweight fabrics crafted for effortless all-day grace.</p><Link href="/shop">Shop the collection <ArrowRight size={16} /></Link></div><div className="hero-dots"><i /><i className="active" /><i /></div></section>
    <section className="story-strip" aria-label="Highlights">{stories.map((story) => <article key={story.label}><img src={story.image} alt={story.alt} /><div><span className="story-avatar"><img src={story.image} alt="" /></span><strong>{story.label}</strong></div></article>)}</section>
    <section className="mini-section"><div className="section-line"><h2>Categories</h2><Link href="/shop">See all <ArrowRight size={14} /></Link></div><div className="category-row"><Link href="/shop?category=Hijabs"><img src={photoUrls.beige} alt="Hijab collection" /><span>Hijabs</span></Link><Link href="/shop?category=Accessories"><img src={photoUrls.texture} alt="Accessories collection" /><span>Accessories</span></Link></div></section>
    <section className="mini-section top-products"><div className="section-line"><h2>Top Products</h2><Link href="/shop">See all <ArrowRight size={14} /></Link></div><TopProductsRow products={products} /></section>
    <div className="collections">{collections.map((collection) => <section className={`collection-panel tone-${collection.tone}`} id={collection.id} key={collection.id}><header><div><span className="eyebrow">◇ {collection.eyebrow}</span><h2>{collection.title}</h2><p>{collection.subtitle}</p></div><Link href="/shop">See all <ArrowRight size={14} /></Link></header>{collection.id === "sale" && <div className="sale-clock"><span>Ends in</span><b>02</b><i>:</i><b>14</b><i>:</i><b>38</b></div>}<div className="product-grid">{collection.productIds.map((id) => <ProductCard product={getProduct(id)} key={id} />)}</div></section>)}</div>
  </main>;
}
