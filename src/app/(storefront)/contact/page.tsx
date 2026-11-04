import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/layout/info-page-layout";

export const metadata: Metadata = { title: "Contact us | Haya Nest" };

export default function ContactPage() {
  return <InfoPageLayout eyebrow="WE ARE HERE TO HELP" title="Contact us" intro="Questions about products, sizing, delivery or an existing order? Reach our customer-care team using the details below."><div className="contact-cards"><a href="tel:+8801700000000"><small>CALL OR WHATSAPP</small><strong>+880 1700-000000</strong><span>Saturday–Thursday, 10am–8pm</span></a><a href="mailto:hello@hayanest.com"><small>EMAIL</small><strong>hello@hayanest.com</strong><span>We normally reply within one working day</span></a></div><h2>Before contacting us</h2><p>For an existing order, include your order ID and checkout phone number. For damaged or incorrect items, please keep the packaging and share an unboxing video within 24 hours of delivery.</p></InfoPageLayout>;
}
