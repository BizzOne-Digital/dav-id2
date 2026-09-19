import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { formatCurrency } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const product = await Product.findOne({ slug, active: true }).lean();
    if (!product) return buildPageMetadata({ title: "Product", path: `/shop/${slug}` });
    return buildPageMetadata({
      title: product.title,
      description: product.description ?? undefined,
      path: `/shop/${slug}`,
    });
  } catch {
    return buildPageMetadata({ title: "Product", path: `/shop/${slug}` });
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let product = null;
  try {
    await connectDB();
    product = await Product.findOne({ slug, active: true }).lean();
  } catch {
    product = null;
  }

  if (!product) notFound();

  return (
    <PageTransition>
      <PageHero title={product.title} subtitle={product.description ?? undefined} />
      <div className="site-x page-y mx-auto max-w-2xl">
        <p className="text-3xl font-bold text-gold">{formatCurrency(product.priceCents)}</p>
        <p className="mt-2 text-sm text-cream/50 capitalize">{product.productType.replace(/_/g, " ")}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <AddToCartButton
            productId={String(product._id)}
            slug={product.slug}
            title={product.title}
            priceCents={product.priceCents}
            image={product.image ?? undefined}
          />
          <Button href="/shop/cart" variant="secondary">Go to cart</Button>
        </div>
      </div>
    </PageTransition>
  );
}
