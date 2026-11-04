import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Brand } from "./site-header";

export function SiteFooter() { return <footer id="footer"><div className="shell footer-grid"><div><Brand /><p>Modest beauty.<br />Everyday, with you.</p></div><div><h3>Shop</h3><Link href="/shop">All products</Link><Link href="/shop?sort=newest">New arrivals</Link><Link href="/shop?category=Accessories">Accessories</Link></div><div><h3>Help</h3><Link href="/shipping-returns">Delivery &amp; returns</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><div><h3>Contact</h3><p>hello@hayanest.com<br />Dhaka, Bangladesh</p><div className="socials"><a href="#footer" aria-label="Facebook"><Facebook /></a><a href="#footer" aria-label="Instagram"><Instagram /></a><a href="#footer" aria-label="Youtube"><Youtube /></a></div></div></div><div className="shell copyright">© 2026 Haya Nest. All rights reserved.</div></footer>; }
