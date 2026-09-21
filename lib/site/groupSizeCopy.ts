/** Site-wide default when DB settings are missing */
export const DEFAULT_MIN_PLAYERS = 1;

/** Booking group type: one ticket path for solo + pair */
export const SINGLE_COUPLE_GROUP_TYPE = "singles_couples";
export const SINGLE_COUPLE_GROUP_LABEL = "Singles & couples (1 ticket)";
export const SINGLE_COUPLE_PLAYER_MAX = 2;

export function resolveMinPlayers(
  pricingMin?: number | null,
  settingsMin?: number | null,
  fallback = DEFAULT_MIN_PLAYERS
): number {
  return pricingMin ?? settingsMin ?? fallback;
}

export function heroGroupSizeLabel(_minPlayers: number): string {
  return "Single group · or competition";
}

export function heroPlayFormatHeadline(): { primary: string; secondary: string } {
  return { primary: "Single group", secondary: "Or competition" };
}

export function pricingGroupSizeSummary(_minPlayers: number, duration: string): string {
  return `Per person · single group or competition · ${duration}`;
}

export function footerGroupSizeLine(_minPlayers: number): string {
  return "$29.95 per person—book as a single group or competing squads; corporate welcome.";
}

export function standardPricingDescription(_minPlayers: number): string {
  return (
    "$29.95 per person for everyone who plays. Choose a single group or competition format when you book. " +
    "Corporate outings can split into squads; groups of 10+ may qualify for corporate volume pricing at checkout."
  );
}

export function bookingPlayerBounds(
  groupType: string,
  huntMinimum: number
): { min: number; max: number } {
  if (groupType === SINGLE_COUPLE_GROUP_TYPE) {
    return { min: 1, max: SINGLE_COUPLE_PLAYER_MAX };
  }
  const min = Math.max(DEFAULT_MIN_PLAYERS, huntMinimum ?? DEFAULT_MIN_PLAYERS);
  return { min, max: 99 };
}
