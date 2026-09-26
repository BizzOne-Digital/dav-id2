export function getNashvilleRank(score: number): string {
  if (score >= 4500) return "Music City Legend";
  if (score >= 3500) return "Honky-Tonk Hero";
  if (score >= 2500) return "Broadway Explorer";
  return "Nashville Rookie";
}

export function calculatePoints(base: number, opts: { hintUsed?: boolean; hintPenalty?: number; wrongAttempts?: number }) {
  let points = base;
  if (opts.hintUsed) points -= opts.hintPenalty ?? 50;
  if (opts.wrongAttempts) points -= Math.min(opts.wrongAttempts * 25, 150);
  return Math.max(points, 50);
}
