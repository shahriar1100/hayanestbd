import type { Collection, Product, Story } from "@/types/store";

export const photoUrls = {
  blush: "https://cdn.shopify.com/s/files/1/0599/0816/1654/files/t27p2.2.jpg?v=1762577319",
  neutrals: "https://behalaal.com/wp-content/uploads/2025/01/Cotton-hijab-set-woven-hijab-set-cotton-hijab-collection-hijabi-essential-nude-hijabs.jpeg",
  beige: "https://www.hautehijab.com/cdn/shop/files/2024_Homepages_-_Mobile_7.jpg?v=1740669917&width=750",
  ivory: "https://www.jola-hijab.com/images/hero.png",
  rose: "https://cdn.salla.sa/PzDYB/kb1hMqIZukSJvNLhqQcwgdpX7Wuas7IOyiIjW0a7.jpg",
  texture: "https://mawdeest.co.uk/cdn/shop/files/Untitled_1080_x_1080_px.png?v=1752704392",
} as const;

export const stories: Story[] = [
  { label: "New in", image: photoUrls.rose, alt: "New season modest styling" },
  { label: "Modal edit", image: photoUrls.neutrals, alt: "Neutral modal scarves" },
  { label: "Styling", image: photoUrls.beige, alt: "Soft beige hijab styling" },
  { label: "Haya looks", image: photoUrls.blush, alt: "Everyday modest fashion" },
  { label: "Daily wear", image: photoUrls.texture, alt: "Daily scarf collection" },
  { label: "Customer love", image: photoUrls.ivory, alt: "Elegant modest outfit" },
];

const detail = "Breathable, beautifully draped fabric with a soft hand-feel, opaque coverage and an easy all-day finish.";
const base = { sizes: ["Standard", "52", "54", "56"], stock: 18, rating: 4.8, description: detail };
export const products: Product[] = [
  { ...base, id: "rose-modal", slug: "rose-modal-hijab", name: "Rose Modal Hijab", price: 650, fabric: "Modal", colour: "Dusty rose", image: photoUrls.blush, gallery: [photoUrls.blush, photoUrls.texture], alt: "Rose modal hijab", badge: "New", category: "Hijabs" },
  { ...base, id: "neutral-set", slug: "signature-modal-set", name: "Signature Modal Set", price: 560, originalPrice: 700, fabric: "Modal", colour: "Neutral edit", image: photoUrls.neutrals, gallery: [photoUrls.neutrals, photoUrls.texture], alt: "Folded neutral hijab set", badge: "20%", category: "Hijabs", stock: 9 },
  { ...base, id: "olive-jersey", slug: "olive-jersey-hijab", name: "Olive Jersey Hijab", price: 750, fabric: "Jersey", colour: "Olive", image: photoUrls.rose, gallery: [photoUrls.rose, photoUrls.blush], alt: "Olive toned modest hijab styling", category: "Hijabs" },
  { ...base, id: "soft-chiffon", slug: "soft-chiffon-hijab", name: "Soft Chiffon Hijab", price: 490, fabric: "Chiffon", colour: "Champagne", image: photoUrls.beige, gallery: [photoUrls.beige, photoUrls.ivory], alt: "Soft beige chiffon hijab", category: "Hijabs" },
  { ...base, id: "ivory-satin", slug: "ivory-prayer-set", name: "Ivory Prayer Set", price: 1850, fabric: "Silk", colour: "Ivory", image: photoUrls.ivory, gallery: [photoUrls.ivory, photoUrls.beige], alt: "Ivory modest fashion look", badge: "New", category: "Prayer Sets", stock: 7 },
  { ...base, id: "mauve-chiffon", slug: "mauve-chiffon-hijab", name: "Mauve Chiffon Hijab", price: 680, fabric: "Georgette", colour: "Mauve", image: photoUrls.texture, gallery: [photoUrls.texture, photoUrls.neutrals], alt: "Mauve chiffon scarf set", category: "Hijabs" },
  { ...base, id: "latte-modal", slug: "latte-abaya", name: "Latte Everyday Abaya", price: 2650, originalPrice: 3100, fabric: "Cotton", colour: "Latte", image: photoUrls.neutrals, gallery: [photoUrls.neutrals, photoUrls.blush], alt: "Latte modest abaya", badge: "Best seller", category: "Abayas", stock: 11 },
  { ...base, id: "pearl-jersey", slug: "pearl-magnet-set", name: "Pearl Magnet Set", price: 320, fabric: "Metal", colour: "Pearl", image: photoUrls.beige, gallery: [photoUrls.beige, photoUrls.texture], alt: "Pearl hijab magnet set", category: "Accessories", sizes: ["Standard"] },
];

export const collections: Collection[] = [
  { id: "new", eyebrow: "Fresh arrivals", title: "New Items", subtitle: "Seasonal hues and refined fabrics for effortless everyday styling.", tone: "blue", productIds: ["rose-modal", "neutral-set", "olive-jersey", "soft-chiffon"] },
  { id: "sale", eyebrow: "Limited time offer", title: "Flash Sale", subtitle: "Signature drapes at special prices—only while the edit lasts.", tone: "red", productIds: ["latte-modal", "rose-modal", "ivory-satin", "neutral-set", "soft-chiffon", "mauve-chiffon"] },
  { id: "popular", eyebrow: "Our best sellers", title: "Most Popular", subtitle: "The textures and shades our community returns to.", tone: "sky", productIds: ["latte-modal", "soft-chiffon", "pearl-jersey", "mauve-chiffon", "olive-jersey"] },
  { id: "curated", eyebrow: "Curated picks", title: "Just For You", subtitle: "Versatile modest styles selected for weekday ease and occasions.", tone: "blue", productIds: ["rose-modal", "neutral-set", "olive-jersey", "mauve-chiffon", "soft-chiffon", "ivory-satin"] },
];

export const getProduct = (id: string) => products.find((product) => product.id === id)!;
export const formatPrice = (price: number) => `৳${price.toLocaleString("en-BD")}`;
