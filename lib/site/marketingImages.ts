/** Local marketing photography — paths under /public/images */

export const MARKETING_IMAGES = {
  hero: {
    src: "/images/hero-nashville.jpg",
    alt: "Nashville skyline at sunset with scavenger hunt route through downtown",
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
    alt: "Nashville skyline and pedestrian bridge over the Cumberland River at sunset",
  },
  mapPin: {
    src: "/images/map-pin-downtown.jpg",
    alt: "Giant map pin on a Nashville street at golden hour",
  },
  porch: {
    src: "/images/porch-adventure.jpg",
    alt: "Map and compass on a porch overlooking the Nashville skyline",
  },
  hotChicken: {
    src: "/images/hot-chicken-hunt.jpg",
    alt: "Nashville hot chicken and scavenger hunt envelope with city views",
  },
  qrScan: {
    src: "/images/qr-scan-challenge.jpg",
    alt: "Player scanning a partner QR code on a brick wall in Nashville",
  },
  flatlay: {
    src: "/images/flatlay-game-board.jpg",
    alt: "Scavenger hunt map, compass, and phone with Nashville route",
  },
  prizes: {
    src: "/images/prizes-trophy.jpg",
    alt: "Trophy and prizes with Nashville skyline at sunset",
  },
  certificate: {
    src: "/images/certificate-celebration.jpg",
    alt: "Completion certificate and polaroids with Nashville skyline at night",
  },
} as const;

export type MarketingImageKey = keyof typeof MARKETING_IMAGES;

export const ALL_MARKETING_IMAGES = Object.values(MARKETING_IMAGES);

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
