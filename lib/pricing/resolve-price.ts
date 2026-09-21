/** Standard posted rate per player */
export const DEFAULT_STANDARD_PRICE_CENTS = 2995;

/** Groups of 10+ (includes corporate at 10+) */
export const DEFAULT_VOLUME_PRICE_CENTS = 2500;

export const DEFAULT_VOLUME_MIN_PLAYERS = 10;

export const VOLUME_PRICING_SUMMARY =
  "Corporate groups of 10+ players: $25.00 per person at checkout.";

export const PUBLIC_PRICING_LINE = "$29.95 per person — every player, every group.";

export type ResolvePriceInput = {
  playerCount: number;
  groupType?: string | null;
  basePriceCents?: number | null;
  volumePriceCents?: number | null;
  volumeMinPlayers?: number | null;
};

/**
 * Resolves per-person price: standard rate for most bookings.
 * Volume rate applies only to corporate group type at 10+ players.
 */
export function resolvePricePerPersonCents(input: ResolvePriceInput): number {
  const base = input.basePriceCents ?? DEFAULT_STANDARD_PRICE_CENTS;
  const volumePrice = input.volumePriceCents ?? DEFAULT_VOLUME_PRICE_CENTS;
  const volumeMin = input.volumeMinPlayers ?? DEFAULT_VOLUME_MIN_PLAYERS;
  const count = Math.max(0, input.playerCount);
  const isCorporate = input.groupType === "corporate";

  if (isCorporate && count >= volumeMin) {
    return volumePrice;
  }
  return base;
}

export function calculateGroupTotalCents(input: ResolvePriceInput): number {
  const perPerson = resolvePricePerPersonCents(input);
  return perPerson * Math.max(0, input.playerCount);
}
