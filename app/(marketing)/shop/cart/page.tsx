import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { ShopCart } from "@/components/shop/ShopCart";
import { buildPageMetadata } from "@/lib/site/buildMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Cart",
  description: "Review gift cards and shop items in your Music City Scavenger Hunt cart.",
  path: "/shop/cart",
});

export default function ShopCartPage() {
  return (
    <PageTransition>
      <PageHero title="Your cart" subtitle="Update quantities or request checkout when you're ready." />
      <div className="site-x page-y mx-auto max-w-3xl">
        <ShopCart />
      </div>
    </PageTransition>
  );
}
