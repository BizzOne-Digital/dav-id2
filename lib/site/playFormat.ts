import { SINGLE_COUPLE_GROUP_TYPE } from "@/lib/site/groupSizeCopy";

/** How the group plays on hunt day — drives team setup & billing UX */
export type PlayFormat = "single_group" | "competition";

export const PLAY_FORMAT_OPTIONS: Array<{
  value: PlayFormat;
  title: string;
  summary: string;
  detail: string;
}> = [
  {
    value: "single_group",
    title: "Single group",
    summary: "One team, one join code—explore Music City together.",
    detail: "Best for couples, families, and friends who want one shared experience on the leaderboard.",
  },
  {
    value: "competition",
    title: "Competition",
    summary: "Competing squads with separate names, colors, and join codes.",
    detail: "Race friends or departments on the same hunt window—ideal for rivalry and corporate team-building.",
  },
];

export function defaultPlayFormat(groupType: string): PlayFormat {
  if (groupType === "corporate") return "competition";
  return "single_group";
}

export function playFormatLabel(format: PlayFormat): string {
  return format === "competition" ? "Competition (squads)" : "Single group";
}

/** Singles/couples ticket path is always one group */
export function playFormatAvailable(groupType: string, playerCount: number): boolean {
  if (groupType === SINGLE_COUPLE_GROUP_TYPE && playerCount <= 2) {
    return false;
  }
  return playerCount >= 2;
}

export function competitionAllowsMultiSquads(
  playFormat: PlayFormat,
  groupType: string,
  playerCount: number
): boolean {
  if (playFormat !== "competition") return false;
  if (groupType === "corporate" && playerCount >= 4) return true;
  if (playerCount >= 6) return true;
  return false;
}
