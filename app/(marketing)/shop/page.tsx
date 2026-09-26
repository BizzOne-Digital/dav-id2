import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { connectDB } from "@/lib/db/connect";
import { Product, type IProduct } from "@/lib/models/Product";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { formatCurrency } from "@/lib/utils";
import { HUNT_CARD_IMAGES, PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop",
  description: "Gift cards, vouchers, and hunt add-ons for Nashville Scavenger Hunt.",
  path: "/shop",
});

export default async function ShopPage() {
  let products: IProduct[] = [];

  try {
    await connectDB();
    products = (await Product.find({ active: true }).sort({ title: 1 }).lean()) as IProduct[];
  } catch {
    products = [];
  }

  return (
    <PageTransition>
      <PageHero
        eyebrow="Gifts & add-ons"
        title="Shop"
        subtitle="Gift cards and vouchers for birthdays, teams, and Music City visitors."
        backgroundImage={PAGE_HERO_IMAGES.shop}
      />
      <div className="site-x page-y mx-auto max-w-7xl">
        <div className="mb-8 flex justify-end">
          <Button href="/shop/cart" variant="secondary">View cart</Button>
        </div>
        {products.length === 0 ? (
          <p className="text-center text-cream/70">No products listed yet.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const img = product.image || HUNT_CARD_IMAGES[index % HUNT_CARD_IMAGES.length].src;
              const displayImg = resolvePublicImageUrl(img);
              return (
              <li key={product.slug}>
                <Link href={`/shop/${product.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden p-0 hover:border-gold/40">
                    <div className="relative h-40">
                      <Image src={displayImg} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="320px" unoptimized={img.startsWith("/api/uploads/")} />
                    </div>
                    <div className="p-5">
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription className="mt-2">{product.description}</CardDescription>
                    <p className="mt-4 font-semibold text-gold">{formatCurrency(product.priceCents)}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-cream/50">{product.productType}</p>
                    </div>
                  </Card>
                </Link>
              </li>
            );})}
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
