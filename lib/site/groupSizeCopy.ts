/** Site-wide default when DB settings are missing */
export const DEFAULT_MIN_PLAYERS = 1;

/** One ticket per player — each ticket is one hunt game */
export const TICKET_ONE_GAME_LINE = "One ticket = one player = one hunt game.";

export const SINGLE_GROUP_TYPE = "single";
export const COUPLE_GROUP_TYPE = "couple";

/** @deprecated Legacy bookings — use `single` or `couple` */
export const SINGLE_COUPLE_GROUP_TYPE = "singles_couples";
export const SINGLE_COUPLE_GROUP_LABEL = "Singles & couples";
export const SINGLE_COUPLE_PLAYER_MAX = 2;

export function isSoloOrPairGroupType(groupType: string): boolean {
  return (
    groupType === SINGLE_GROUP_TYPE ||
    groupType === COUPLE_GROUP_TYPE ||
    groupType === SINGLE_COUPLE_GROUP_TYPE
  );
}

/** Maps booking group types to route-recipe keys in the database */
export function routeRecipeGroupType(groupType: string): string {
  if (isSoloOrPairGroupType(groupType)) return SINGLE_COUPLE_GROUP_TYPE;
  return groupType;
}

export function resolveMinPlayers(
  pricingMin?: number | null,
  settingsMin?: number | null,
  fallback = DEFAULT_MIN_PLAYERS
): number {
  return pricingMin ?? settingsMin ?? fallback;
}

export function heroGroupSizeLabel(_minPlayers?: number): string {
  void _minPlayers;
  return "Single · couple · or group";
}

export function heroPlayFormatHeadline(): { primary: string; secondary: string } {
  return { primary: "Single, couple, or group", secondary: "One ticket = one game" };
}

export function pricingGroupSizeSummary(_minPlayers: number | undefined, duration: string): string {
  void _minPlayers;
  return `Per person · ${TICKET_ONE_GAME_LINE} · ${duration}`;
}

export function footerGroupSizeLine(_minPlayers?: number): string {
  void _minPlayers;
  return "$29.95 per person—single, couple, or group; corporate welcome.";
}

export function standardPricingDescription(_minPlayers?: number): string {
  void _minPlayers;
  return (
    "$29.95 per person. " +
    TICKET_ONE_GAME_LINE +
    " Book as a single player, a couple (2 tickets), or a group. Corporate outings can split into squads; groups of 10+ may qualify for volume pricing at checkout."
  );
}

export function bookingPlayerBounds(
  groupType: string,
  huntMinimum: number
): { min: number; max: number } {
  if (groupType === SINGLE_GROUP_TYPE) {
    return { min: 1, max: 1 };
  }
  if (groupType === COUPLE_GROUP_TYPE) {
    return { min: 2, max: 2 };
  }
  if (groupType === SINGLE_COUPLE_GROUP_TYPE) {
    return { min: 1, max: SINGLE_COUPLE_PLAYER_MAX };
  }
  const min = Math.max(DEFAULT_MIN_PLAYERS, huntMinimum ?? DEFAULT_MIN_PLAYERS);
  return { min, max: 99 };
}

export function fixedTicketCountForGroupType(groupType: string): number | null {
  if (groupType === SINGLE_GROUP_TYPE) return 1;
  if (groupType === COUPLE_GROUP_TYPE) return 2;
  return null;
}

/** First ticket count when switching from single/couple into a multi-player group booking */
export function suggestedTicketsForGroupBooking(groupType: string, huntMinimum = DEFAULT_MIN_PLAYERS): number {
  const min = Math.max(DEFAULT_MIN_PLAYERS, huntMinimum);
  if (groupType === "corporate") return Math.max(6, min);
  return Math.max(3, min);
}
