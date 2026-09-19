export type MarketingSettings = {
  businessName?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  domain?: string;
  logoUrl?: string | null;
  newsletterHeading?: string;
  footerText?: string;
  hero?: {
    headline?: string;
    subheadline?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    backgroundImage?: string;
  };
  defaultPricePerPersonCents?: number;
  minimumPlayers?: number;
  typicalDurationHours?: string;
};

export type MarketingPricing = {
  name?: string;
  pricePerPersonCents?: number;
  minimumPlayers?: number;
  maximumPlayers?: number;
  durationLabel?: string;
  features?: string[];
  description?: string;
  priceType?: string;
};

export type MarketingFaqItem = {
  question: string;
  answer: string;
};

export type MarketingTestimonial = {
  quote: string;
  name?: string;
  groupType?: string;
  rating?: number;
};

export type MarketingLeaderboardRow = {
  rank: number;
  name: string;
  score: number;
  completedStops?: number;
};
