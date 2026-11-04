import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return <><AnnouncementBar /><SiteHeader />{children}<SiteFooter /><CartDrawer /></>;
}
