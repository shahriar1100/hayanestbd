import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/layout/info-page-layout";

export const metadata: Metadata = { title: "About us | Haya Nest" };

export default function AboutPage() {
  return <InfoPageLayout eyebrow="OUR STORY" title="Modesty, made beautifully simple" intro="Haya Nest brings together thoughtful coverage, comfortable fabrics and refined everyday design for women across Bangladesh."><h2>Why Haya Nest</h2><p>We believe modest fashion should feel effortless. Every edit is selected for breathable comfort, dependable coverage and colours that are easy to wear from weekday routines to special occasions.</p><h2>Our promise</h2><p>We describe fabrics clearly, price fairly and support every order with responsive local care. Our goal is to help you choose with confidence and enjoy each piece for longer.</p><h2>Designed around real life</h2><p>From easy-care hijabs to versatile abayas and practical accessories, our collections are curated to make daily styling calmer, faster and more personal.</p></InfoPageLayout>;
}
