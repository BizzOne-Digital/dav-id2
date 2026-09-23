/** Local marketing photography — paths under /public/images */

export const MARKETING_IMAGES = {
  hero: {
    src: "/images/hero-nashville.jpg",
    alt: "Music City skyline at sunset with scavenger hunt route through downtown",
  },
  ryman: {
    src: "/images/ryman-guitar-case.jpg",
    alt: "Ryman Auditorium at golden hour with guitar case on the sidewalk",
  },
  broadway: {
    src: "/images/broadway-neon.jpg",
    alt: "Broadway neon signs reflecting on wet pavement at dusk",
  },
  skylineRiver: {
    src: "/images/skyline-river-sunset.jpg",
    alt: "Music City skyline and pedestrian bridge over the Cumberland River at sunset",
  },
  mapPin: {
    src: "/images/map-pin-downtown.jpg",
    alt: "Giant map pin on a Music City street at golden hour",
  },
  porch: {
    src: "/images/porch-adventure.jpg",
    alt: "Map and compass on a porch overlooking the Music City skyline",
  },
  hotChicken: {
    src: "/images/hot-chicken-hunt.jpg",
    alt: "Music City hot chicken and scavenger hunt envelope with city views",
  },
  qrScan: {
    src: "/images/qr-scan-challenge.jpg",
    alt: "Player scanning a partner QR code on a brick wall in Music City",
  },
  flatlay: {
    src: "/images/flatlay-game-board.jpg",
    alt: "Scavenger hunt map, compass, and phone with Music City route",
  },
  prizes: {
    src: "/images/prizes-trophy.jpg",
    alt: "Trophy and prizes with Music City skyline at sunset",
  },
  bachelorette: {
    src: "/images/bachelorette-broadway-party.jpg",
    alt: "Bachelorette group celebrating on Broadway in Music City at night",
  },
  certificate: {
    src: "/images/certificate-celebration.jpg",
    alt: "Completion certificate and polaroids with Music City skyline at night",
  },
  promoFlyer: {
    src: "/images/nashville-promo-flyer.png",
    alt: "Music City Scavenger Hunt promo — Music City challenge, $29.95 per person, book your adventure",
  },
  /** High-resolution homepage poster (client artwork) */
  promoPoster: {
    src: "/images/nashville-promo-poster.jpg",
    alt: "Music City Scavenger Hunt — The Ultimate Music City Challenge. Explore, solve, compete, win. Book your adventure.",
    width: 648,
    height: 1024,
  },
} as const;

export type MarketingImageKey = keyof typeof MARKETING_IMAGES;

export const ALL_MARKETING_IMAGES = Object.values(MARKETING_IMAGES);

/** Photo strip only — promo artwork is shown in PromoFlyerSection, not duplicated here */
export const GALLERY_STRIP_IMAGES = ALL_MARKETING_IMAGES.filter(
  (img) => img !== MARKETING_IMAGES.promoFlyer && img !== MARKETING_IMAGES.promoPoster
);

/** Cycle images for hunt cards when DB cover is empty */
export const HUNT_CARD_IMAGES = [
  MARKETING_IMAGES.broadway,
  MARKETING_IMAGES.ryman,
  MARKETING_IMAGES.flatlay,
  MARKETING_IMAGES.mapPin,
  MARKETING_IMAGES.skylineRiver,
  MARKETING_IMAGES.qrScan,
  MARKETING_IMAGES.prizes,
];

export const PAGE_HERO_IMAGES: Record<string, (typeof MARKETING_IMAGES)[MarketingImageKey]> = {
  about: MARKETING_IMAGES.ryman,
  hunts: MARKETING_IMAGES.broadway,
  pricing: MARKETING_IMAGES.hotChicken,
  contact: MARKETING_IMAGES.mapPin,
  "how-it-works": MARKETING_IMAGES.flatlay,
  faq: MARKETING_IMAGES.porch,
  safety: MARKETING_IMAGES.skylineRiver,
  shop: MARKETING_IMAGES.prizes,
  booking: MARKETING_IMAGES.flatlay,
  "refund-policy": MARKETING_IMAGES.certificate,
  terms: MARKETING_IMAGES.ryman,
  privacy: MARKETING_IMAGES.porch,
};
