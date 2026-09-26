import { getSiteSettings } from "@/lib/site/getSiteSettings";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import type { MarketingPricing, MarketingSettings } from "@/components/marketing/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, pricing } = await getSiteSettings();

  const marketingSettings = settings as MarketingSettings;
  const marketingPricing = pricing as MarketingPricing | null;

  return (
    <div className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-charcoal text-cream">
      <Header settings={marketingSettings} />
      <main className="min-w-0 flex-1">{children}</main>
      <Footer settings={marketingSettings} pricing={marketingPricing} />
    </div>
  );
}
