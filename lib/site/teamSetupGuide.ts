/** Team / squad setup copy and helpers for booking & how-it-works */

export const TEAM_COLORS = ["BLUE", "GOLD", "GREEN", "PINK", "RED", "CYAN"] as const;
export type TeamColor = (typeof TEAM_COLORS)[number];

export type SquadPlan = {
  name: string;
  color: TeamColor;
  playerCount: number;
};

export type GroupSetupGuide = {
  title: string;
  summary: string;
  steps: string[];
  teamNamingTip: string;
};

const GUIDES: Record<string, GroupSetupGuide> = {
  singles_couples: {
    title: "Solo or pair",
    summary: "One booking ticket covers 1–2 players on the same team.",
    steps: [
      "Pick a fun team name (even for two people—it shows on the leaderboard).",
      "Choose a team color so friends downtown can spot you.",
      "Both players use the same join code after checkout.",
    ],
    teamNamingTip: "Examples: “Dynamic Duo”, “Broadway Two-Step”, or your last names.",
  },
  friends: {
    title: "Friends group",
    summary: "One team, one join code—every friend needs their own ticket at checkout.",
    steps: [
      "Set your team name and color before you pay.",
      "Share the join code so each ticket holder joins the same squad.",
      "Captain starts the hunt when everyone is in the lobby.",
    ],
    teamNamingTip: "Examples: “Honky Tonk Heroes”, “Neon Nomads”.",
  },
  family: {
    title: "Family outing",
    summary: "One team for your crew; each person (including kids) counts as one ticket.",
    steps: [
      "Use a family-friendly team name kids will recognize.",
      "Add player names for personalized certificates.",
      "Captain is usually a parent—starts the hunt from the lobby.",
    ],
    teamNamingTip: "Examples: “The Miller Explorers”, “Music City Cousins”.",
  },
  bachelorette: {
    title: "Bachelorette / birthday",
    summary: "One squad, big energy—each guest needs an individual ticket.",
    steps: [
      "Name the team after the guest of honor or an inside joke.",
      "Pick a bold color for photos and leaderboard bragging rights.",
      "Send the join code in the group chat before hunt day.",
    ],
    teamNamingTip: "Examples: “Bride’s Broadway Babes”, “Last Ride on Broadway”.",
  },
  corporate: {
    title: "Corporate & team-building",
    summary:
      "Every employee needs an individual ticket. Split into competing squads so departments can race.",
    steps: [
      "Book total headcount (one ticket per person) in step 1.",
      "In step 2, add squads—each with its own name, color, and player count.",
      "Assign a captain per squad; each squad gets its own join code and game lobby.",
      "Optional: use company + department in squad names (e.g. “Acme Sales BLUE”).",
    ],
    teamNamingTip: "Aim for 6–8 players per squad; add squads until ticket counts match.",
  },
  tourists: {
    title: "Visitors & tourists",
    summary: "Traveling together? One team is easiest; each traveler needs a ticket.",
    steps: [
      "Choose a team name you’ll remember after a few honky-tonks.",
      "Pick a color and share the join code at your hotel or group chat.",
      "Captain starts when your start window begins.",
    ],
    teamNamingTip: "Examples: “Out-of-Towners”, “First Time on Broadway”.",
  },
};

export function getGroupSetupGuide(groupType: string): GroupSetupGuide {
  return GUIDES[groupType] ?? GUIDES.friends;
}

export function shouldOfferMultiSquads(groupType: string, playerCount: number): boolean {
  if (groupType === "corporate" && playerCount >= 4) return true;
  if (playerCount >= 10) return true;
  return false;
}

export function defaultSingleSquadName(groupType: string): string {
  switch (groupType) {
    case "corporate":
      return "Company Team";
    case "bachelorette":
      return "Celebration Squad";
    case "family":
      return "Family Team";
    case "singles_couples":
      return "Music City Explorer";
    default:
      return "Broadway Squad";
  }
}

/** Split tickets across N squads as evenly as possible */
export function buildDefaultSquads(
  playerCount: number,
  squadCount: number,
  baseName: string,
  baseColor: TeamColor
): SquadPlan[] {
  const count = Math.max(1, Math.min(squadCount, playerCount, TEAM_COLORS.length));
  const base = Math.floor(playerCount / count);
  const extra = playerCount % count;

  return Array.from({ length: count }, (_, i) => ({
    name: count === 1 ? baseName : `${baseName} ${i + 1}`,
    color: TEAM_COLORS[i % TEAM_COLORS.length] ?? baseColor,
    playerCount: base + (i < extra ? 1 : 0),
  }));
}

export function squadTicketTotal(squads: SquadPlan[]): number {
  return squads.reduce((sum, s) => sum + Math.max(0, s.playerCount), 0);
}

export function validateSquads(squads: SquadPlan[], requiredTickets: number): string | null {
  if (!squads.length) return "Add at least one squad.";
  for (const s of squads) {
    if (!s.name.trim()) return "Every squad needs a name.";
    if (s.playerCount < 1) return "Each squad needs at least 1 ticket.";
  }
  const total = squadTicketTotal(squads);
  if (total !== requiredTickets) {
    return `Squad tickets must add up to ${requiredTickets} (currently ${total}). Adjust player counts per squad.`;
  }
  return null;
}
