"use client";
declare global { interface Window { fbq?: (...args: unknown[]) => void } }
export function trackPixel(event: "ViewContent"|"AddToCart"|"InitiateCheckout"|"Purchase", data: Record<string,unknown>={}) { if (typeof window !== "undefined" && typeof window.fbq === "function") window.fbq("track",event,data); }
