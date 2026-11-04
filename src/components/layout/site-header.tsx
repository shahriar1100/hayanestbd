"use client";
import Link from "next/link";
import { ChevronDown, ChevronRight, Heart, Home, Leaf, Menu, Search, ShoppingBag, Store, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { useSaved } from "@/components/saved/saved-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Brand() { return <Link className="brand" href="/" aria-label="Haya Nest home"><Leaf className="brand-mark" aria-hidden="true" /><strong>HAYA</strong><small>NEST</small></Link>; }

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const { count, setOpen: setCartOpen } = useCart();
  const { count: savedCount } = useSaved();
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKey); };
  }, [open]);

  return <>
    <header className="site-header"><div className="shell nav-inner"><Brand />
      <nav aria-label="Primary"><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/shop?sort=newest">New arrivals</Link><Link href="/shop?category=Abayas">Collections</Link></nav>
      <div className="header-actions"><Link className="search-box" href="/shop"><Search size={15} /><span>Search products...</span></Link><Link className="icon-btn mobile-search-btn" href="/shop" aria-label="Search products"><Search size={21} /></Link><ThemeToggle /><Link className="icon-btn" href="/account" aria-label="Account"><UserRound size={18} /></Link><Link className="icon-btn" href="/saved" aria-label={`Saved products${savedCount ? ` (${savedCount})` : ""}`}><Heart size={18} /></Link><button className="bag-btn" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={18} /><span>{count}</span></button><button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button></div>
    </div></header>
    <div className={`menu-overlay ${open ? "is-open" : ""}`} onClick={closeMenu} aria-hidden={!open} inert={!open}>
      <aside className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" onClick={(event) => event.stopPropagation()}>
        <header className="mobile-menu-header"><span>EXPLORE HAYA NEST</span><h2>Menu</h2><button type="button" className="menu-close" onClick={closeMenu} aria-label="Close menu"><X /></button></header>
        <div className="mobile-menu-scroll">
          <div className="menu-primary-links">
            <Link className={pathname === "/" ? "active" : ""} href="/" onClick={closeMenu}><span>Home</span><ChevronRight /></Link>
            <Link className={pathname.startsWith("/shop") ? "active" : ""} href="/shop" onClick={closeMenu}><span>Shop All</span><ChevronRight /></Link>
            <Link className={pathname.startsWith("/saved") ? "active" : ""} href="/saved" onClick={closeMenu}><span>Saved products</span><ChevronRight /></Link>
            <Link className={pathname.startsWith("/account") ? "active" : ""} href="/account" onClick={closeMenu}><span>My Account</span><ChevronRight /></Link>
            <button type="button" className={categoriesOpen ? "is-expanded" : ""} onClick={() => setCategoriesOpen((current) => !current)} aria-expanded={categoriesOpen}><span>Categories</span><ChevronDown /></button>
            <div className={`menu-categories ${categoriesOpen ? "is-open" : ""}`}>
              {["Hijabs", "Abayas", "Prayer Sets", "Accessories"].map((category) => <Link href={`/shop?category=${encodeURIComponent(category)}`} onClick={closeMenu} key={category}>{category}<ChevronRight /></Link>)}
            </div>
          </div>
          <div className="menu-secondary-links">
            <Link href="/account#orders" onClick={closeMenu}><span>My Orders</span><ChevronRight /></Link>
            <Link href="/about" onClick={closeMenu}><span>About Us</span><ChevronRight /></Link>
            <Link href="/contact" onClick={closeMenu}><span>Contact Us</span><ChevronRight /></Link>
            <Link href="/shipping-returns" onClick={closeMenu}><span>Delivery &amp; Returns</span><ChevronRight /></Link>
            <Link href="/faq" onClick={closeMenu}><span>Help / FAQ</span><ChevronRight /></Link>
          </div>
        </div>
        <footer className="mobile-menu-footer"><ThemeToggle variant="menu" /></footer>
      </aside>
    </div>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <Link href="/" className={pathname === "/" ? "active" : ""} aria-current={pathname === "/" ? "page" : undefined}><Home /><span>Home</span></Link>
      <Link href="/shop" className={pathname.startsWith("/shop") ? "active" : ""} aria-current={pathname.startsWith("/shop") ? "page" : undefined}><Store /><span>Shop</span></Link>
      <Link href="/saved" className={pathname.startsWith("/saved") ? "active" : ""} aria-current={pathname.startsWith("/saved") ? "page" : undefined}><span className="bottom-nav-icon"><Heart />{savedCount > 0 && <b>{savedCount > 99 ? "99+" : savedCount}</b>}</span><span>Saved</span></Link>
      <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open bag with ${count} items`}><span className="bottom-nav-icon"><ShoppingBag />{count > 0 && <b>{count > 99 ? "99+" : count}</b>}</span><span>Bag</span></button>
      <Link href="/account" className={pathname.startsWith("/account") ? "active" : ""} aria-current={pathname.startsWith("/account") ? "page" : undefined}><UserRound /><span>Account</span></Link>
    </nav>
  </>;
}
