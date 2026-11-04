import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { SavedProvider } from "@/components/saved/saved-provider";

export const metadata: Metadata = {
  title: "Haya Nest — Modest, made modern",
  description: "A modern Bangladesh modest-wear storefront for refined hijabs and everyday essentials.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.getItem('haya-theme')||'dark'}catch(e){}` }} /></head><body><SavedProvider><CartProvider>{children}</CartProvider></SavedProvider></body></html>;
}
