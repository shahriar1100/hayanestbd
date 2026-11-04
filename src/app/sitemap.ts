import type { MetadataRoute } from "next";
import { products } from "@/data/store";
export default function sitemap(): MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"; const routes=["","/shop","/cart","/checkout","/account","/privacy","/terms","/shipping-returns"]; return [...routes.map((route)=>({url:`${base}${route}`,lastModified:new Date()})),...products.map((p)=>({url:`${base}/products/${p.slug}`,lastModified:new Date()}))]; }
