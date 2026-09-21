/** Player & ticket rules shown in booking and FAQs */

export const COMPETITION_RULES = {
  headline: "How you play",
  bullets: [
    "Every person who plays needs a ticket at $29.95 per person—solo, one group, or each competing squad.",
    "Single group: one team name, one color, one join code—perfect for couples, families, and one crew.",
    "Competition: split into squads that race on the leaderboard (great for friends or corporate departments).",
    "Corporate: book headcount, choose competition, assign squad names/colors—or contact us for a facilitated event.",
    "Each paid player earns their own completion certificate at the finish.",
  ],
  corporateNote:
    "Corporate bookings use competition format with optional multi-squad setup; volume pricing may apply at 10+ players.",
} as const;

export function suggestedTeamCount(playerCount: number, groupType: string): number {
  if (groupType === "corporate" && playerCount >= 10) {
    return Math.max(2, Math.ceil(playerCount / 8));
  }
  if (playerCount >= 10) return Math.max(2, Math.ceil(playerCount / 6));
  return 1;
}

export function rosterLabel(index: number): string {
  return index === 0 ? "Player 1 (captain)" : `Player ${index + 1}`;
}
