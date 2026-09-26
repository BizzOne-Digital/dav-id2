import { Gift, Percent, Ticket } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { InGameOffersConfig, InGameOfferSlot } from "@/lib/site/inGameOffers";

const ICONS = {
  discounts: Percent,
  coupons: Ticket,
  prizes: Gift,
} as const;

const ACCENTS = {
  discounts: "border-denim/40 bg-denim/10",
  coupons: "border-gold/40 bg-gold/10",
  prizes: "border-crimson/40 bg-crimson/10",
} as const;

function OfferCard({
  slotKey,
  offer,
}: {
  slotKey: keyof typeof ICONS;
  offer: InGameOfferSlot;
}) {
  if (offer.published === false) return null;

  const Icon = ICONS[slotKey];

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-6 shadow-lg backdrop-blur-sm",
        ACCENTS[slotKey]
      )}
    >
      {offer.comingSoon !== false && (
        <Badge variant="outline" className="absolute right-4 top-4 border-gold/50 text-gold">
          Coming soon
        </Badge>
      )}
      <span className="flex size-12 items-center justify-center rounded-full bg-charcoal/80">
        <Icon className="size-6 text-gold" aria-hidden />
      </span>
      <h3 className="mt-4 font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-cream">
        {offer.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/75">{offer.description}</p>
      {offer.note && (
        <p className="mt-4 rounded-lg border border-dashed border-cream/20 bg-charcoal/40 px-3 py-2 text-xs text-cream/55">
          {offer.note}
        </p>
      )}
    </article>
  );
}

type InGameOffersSectionProps = {
  offers: InGameOffersConfig;
};

export function InGameOffersSection({ offers }: InGameOffersSectionProps) {
  const cards = (
    [
      ["discounts", offers.discounts],
      ["coupons", offers.coupons],
      ["prizes", offers.prizes],
    ] as const
  ).filter(([, o]) => o.published !== false);

  if (cards.length === 0) return null;

  return (
    <section id="in-game-offers" className="section-y border-y border-cream/10 bg-[#0c0e11]">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="During your hunt"
          title={offers.heading}
          subtitle={offers.subtitle}
        />
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-gold/90">
          Explore · Solve · Compete · Win — plus partner perks along the way.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map(([key, offer]) => (
            <OfferCard key={key} slotKey={key} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
