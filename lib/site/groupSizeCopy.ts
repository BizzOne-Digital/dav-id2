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

export function heroGroupSizeLabel(minPlayers: number): string {
  if (minPlayers <= 1) {
    return "Singles & Couples · 1 Ticket";
  }
  return `Minimum ${minPlayers} Players`;
}

export function pricingGroupSizeSummary(minPlayers: number, duration: string): string {
  if (minPlayers <= 1) {
    return `Singles & couples on one ticket · ${duration}`;
  }
  return `Minimum ${minPlayers} players · ${duration}`;
}

export function footerGroupSizeLine(minPlayers: number): string {
  if (minPlayers <= 1) {
    return "Singles & couples welcome—same per-person rate, one ticket for 1–2 players.";
  }
  return `Clues, challenges, and bragging rights—minimum ${minPlayers} players.`;
}

export function standardPricingDescription(minPlayers: number): string {
  const volume =
    "Groups of 10 or more—including corporate—pay $25 per player.";
  if (minPlayers <= 1) {
    return `$29.95 per person. Singles and couples book on one ticket (1–2 players). ${volume}`;
  }
  return `$29.95 per person with a ${minPlayers}-player minimum. ${volume}`;
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
