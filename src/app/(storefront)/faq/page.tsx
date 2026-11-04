import type { Metadata } from "next";
import { InfoPageLayout } from "@/components/layout/info-page-layout";

export const metadata: Metadata = { title: "Help and FAQ | Haya Nest" };

const questions = [
  ["How long does delivery take?", "Inside Dhaka orders normally arrive within 24–48 hours. Other districts normally take 3–5 working days after confirmation."],
  ["Can I exchange a product?", "Yes. Contact us within seven days of delivery. The item must be unworn, unwashed and returned with its original tags and packaging."],
  ["How can I track my order?", "Sign in to My Account and open My Orders. You can also search using the phone number used during checkout."],
  ["Which payment methods are available?", "Cash on delivery, bKash and Nagad are supported during checkout. Available options are shown before you place the order."],
  ["How do Saved products work?", "Tap the heart on any product. Your favourites are stored on the current device and remain available from the Saved products page."],
];

export default function FaqPage() {
  return <InfoPageLayout eyebrow="HELP CENTRE" title="Frequently asked questions" intro="Quick answers about ordering, delivery, exchanges, payment and saved products."><div className="faq-list">{questions.map(([question, answer], index) => <details open={index === 0} key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></InfoPageLayout>;
}
