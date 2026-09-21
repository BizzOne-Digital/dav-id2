/** Player & ticket rules shown in booking and FAQs */

export const COMPETITION_RULES = {
  headline: "How tickets & teams work",
  bullets: [
    "Every person who competes on the leaderboard needs their own paid ticket (per-person pricing at checkout).",
    "Singles and couples can share one booking ticket option for 1–2 players; larger groups purchase one ticket per player.",
    "Corporate and private events: each participant must hold an individual ticket—whether they play solo or on a named team.",
    "Teams are identified by team name and color (and join code) so competitors can tell who is who downtown.",
    "When you finish the hunt, each paid ticket receives its own completion certificate.",
  ],
  corporateNote:
    "For corporate outings with multiple teams, book the total headcount (one ticket per person). Use distinct team names/colors for each squad—or contact us for a facilitated multi-team event.",
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
