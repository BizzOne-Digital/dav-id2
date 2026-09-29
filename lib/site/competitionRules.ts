import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";

/** Player & ticket rules shown in booking and FAQs */

export const COMPETITION_RULES = {
  headline: "How you play",
  bullets: [
    "Single, couple, or group—every player needs their own ticket ($29.95). One ticket = one player = one hunt game.",
    `Your ${HUNT_PLAY_WINDOW_HOURS}-hour play window starts at checkout—join, play, and finish inside that time; then join codes expire. (Checkout when you are ready to play, not months ahead.)`,
    "Single or couple: one team, one join code (couples buy 2 tickets). Groups: one team or competing squads.",
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
