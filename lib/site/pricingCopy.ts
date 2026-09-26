import { formatCurrency } from "@/lib/utils";
import { DEFAULT_STANDARD_PRICE_CENTS } from "@/lib/pricing/resolve-price";

export const STANDARD_RATE_CENTS = DEFAULT_STANDARD_PRICE_CENTS;

export function standardRateLabel(cents = STANDARD_RATE_CENTS): string {
  return `${formatCurrency(cents)} per person`;
}

/** Primary marketing line — simple, play-focused */
export const PRICING_HEADLINE = "$29.95 per person";

export const PRICING_SUBLINE =
  "Same rate for every player—solo, one group, or competing squads. Pay for who plays; pick your format at booking.";

export const CORPORATE_PRICING_NOTE =
  "Corporate bookings: multi-squad competition, individual tickets per employee, and volume rates for groups of 10+ at checkout. Questions? Use contact on the site.";

export function pricingTotalLine(pricePerPersonCents: number, playerCount: number): string {
  return `${formatCurrency(pricePerPersonCents)} per person × ${playerCount} player${playerCount === 1 ? "" : "s"}`;
}
