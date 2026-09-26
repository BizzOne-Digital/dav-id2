export type InGameOfferSlot = {
  title: string;
  description: string;
  note?: string;
  published?: boolean;
  comingSoon?: boolean;
};

export type InGameOffersConfig = {
  heading: string;
  subtitle: string;
  discounts: InGameOfferSlot;
  coupons: InGameOfferSlot;
  prizes: InGameOfferSlot;
};

export const DEFAULT_IN_GAME_OFFERS: InGameOffersConfig = {
  heading: "In-game rewards & partner perks",
  subtitle:
    "During your hunt, teams unlock special placements for discounts, coupons, and prizes from Music City partners. Details are added as partnerships go live.",
  discounts: {
    title: "In-game discounts",
    description: "Save at Music City shops, restaurants, and attractions when you hit certain checkpoints.",
    note: "Partner offers will appear here and inside the live game.",
    published: true,
    comingSoon: true,
  },
  coupons: {
    title: "Hunt coupons",
    description: "Exclusive codes and vouchers earned by completing challenges along your route.",
    note: "Coupon copy and redemption rules coming soon.",
    published: true,
    comingSoon: true,
  },
  prizes: {
    title: "Prizes & bonuses",
    description: "Leaderboard finishes, photo challenges, and wildcard stops can award bonus prizes.",
    note: "Prize list and sponsors to be announced.",
    published: true,
    comingSoon: true,
  },
};

type RawOffers = Partial<InGameOffersConfig> & {
  discounts?: Partial<InGameOfferSlot>;
  coupons?: Partial<InGameOfferSlot>;
  prizes?: Partial<InGameOfferSlot>;
};

function mergeSlot(
  defaults: InGameOfferSlot,
  raw?: Partial<InGameOfferSlot>
): InGameOfferSlot {
  if (!raw) return defaults;
  return {
    title: raw.title?.trim() || defaults.title,
    description: raw.description?.trim() || defaults.description,
    note: raw.note?.trim() || defaults.note,
    published: raw.published ?? defaults.published,
    comingSoon: raw.comingSoon ?? defaults.comingSoon,
  };
}

/** Merge DB settings with defaults for public display. */
export function resolveInGameOffers(raw?: RawOffers | null): InGameOffersConfig {
  if (!raw) return DEFAULT_IN_GAME_OFFERS;
  return {
    heading: raw.heading?.trim() || DEFAULT_IN_GAME_OFFERS.heading,
    subtitle: raw.subtitle?.trim() || DEFAULT_IN_GAME_OFFERS.subtitle,
    discounts: mergeSlot(DEFAULT_IN_GAME_OFFERS.discounts, raw.discounts),
    coupons: mergeSlot(DEFAULT_IN_GAME_OFFERS.coupons, raw.coupons),
    prizes: mergeSlot(DEFAULT_IN_GAME_OFFERS.prizes, raw.prizes),
  };
}

export const OFFER_SLOTS = ["discounts", "coupons", "prizes"] as const;
export type OfferSlotKey = (typeof OFFER_SLOTS)[number];
