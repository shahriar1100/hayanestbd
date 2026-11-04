import type { Order } from "@/types/store";
export function isBangladeshPhone(value: string) { return /^01[3-9]\d{8}$/.test(value.replace(/\D/g, "").slice(-11)); }
export function calculateOrder(subtotal: number, zone: Order["deliveryZone"], discount = 0) { const shippingFee = subtotal >= 3000 ? 0 : zone === "inside-dhaka" ? 70 : 130; return { shippingFee, total: Math.max(0, subtotal - discount + shippingFee) }; }
