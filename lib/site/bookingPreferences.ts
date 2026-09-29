export const FAMILY_FRIENDLY_HUNT_SLUG = "family-friendly-downtown";

/** Route filters applied at game start — no separate preferences step in booking. */
export function deriveBookingRoutePrefs(groupType: string, huntSlug: string) {
  const familyFriendly =
    groupType === "family" || huntSlug === FAMILY_FRIENDLY_HUNT_SLUG;
  return {
    alcoholFree: familyFriendly,
    youngestAge: familyFriendly ? 12 : undefined,
  };
}
