/** Standard posted rate per player */
export const DEFAULT_STANDARD_PRICE_CENTS = 2995;

/** Groups of 10+ (includes corporate at 10+) */
export const DEFAULT_VOLUME_PRICE_CENTS = 2500;

export const DEFAULT_VOLUME_MIN_PLAYERS = 10;

export const VOLUME_PRICING_SUMMARY =
  "Groups of 10+ players (including corporate teams): $25.00 per person.";

export type ResolvePriceInput = {
  playerCount: number;
  groupType?: string | null;
  basePriceCents?: number | null;
  volumePriceCents?: number | null;
  volumeMinPlayers?: number | null;
};

/**
 * Resolves per-person price: 10+ players → volume rate ($25 default).
 * Corporate uses the same 10+ threshold as other group types.
 */
export function resolvePricePerPersonCents(input: ResolvePriceInput): number {
  const base = input.basePriceCents ?? DEFAULT_STANDARD_PRICE_CENTS;
  const volumePrice = input.volumePriceCents ?? DEFAULT_VOLUME_PRICE_CENTS;
  const volumeMin = input.volumeMinPlayers ?? DEFAULT_VOLUME_MIN_PLAYERS;
  const count = Math.max(0, input.playerCount);

  if (count >= volumeMin) {
    return volumePrice;
  }
  return base;
}

export function calculateGroupTotalCents(input: ResolvePriceInput): number {
  const perPerson = resolvePricePerPersonCents(input);
  return perPerson * Math.max(0, input.playerCount);
}
