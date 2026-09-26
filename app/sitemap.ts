import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db/connect";
import { Hunt } from "@/lib/models/Hunt";
import { Product } from "@/lib/models/Product";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/about",
  "/hunts",
  "/pricing",
  "/shop",
  "/shop/cart",
  "/booking",
  "/book-qr",
  "/how-it-works",
  "/faq",
  "/contact",
  "/safety",
  "/terms",
  "/privacy",
  "/refund-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    await connectDB();
    const [hunts, products] = await Promise.all([
      Hunt.find({ status: "published" }).select("slug updatedAt").lean(),
      Product.find({ active: true }).select("slug updatedAt").lean(),
    ]);

    for (const hunt of hunts) {
      entries.push({
        url: `${baseUrl}/hunts/${hunt.slug}`,
        lastModified: hunt.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const product of products) {
      entries.push({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: product.updatedAt ?? now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // static routes only
  }

  return entries;
}
