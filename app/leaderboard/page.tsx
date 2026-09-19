export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db/connect";
import { LeaderboardEntry } from "@/lib/models";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Leaderboard" };

export default async function PublicLeaderboardPage() {
  await connectDB();
  const entries = await LeaderboardEntry.find({ scope: "public", locked: { $ne: true } })
    .sort({ score: -1 })
    .limit(50)
    .lean();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-gold">Leaderboard</h1>
      <p className="mt-2 text-cream/70">Top teams exploring Music City.</p>
      <ol className="mt-8 space-y-3">
        {entries.map((entry, index) => (
          <li key={entry._id.toString()}>
            <Card className="flex items-center justify-between py-4">
              <CardHeader className="mb-0">
                <CardTitle className="text-base">
                  #{index + 1} {entry.teamName ?? "Team"}
                </CardTitle>
                <p className="text-xs text-cream/50">{entry.teamDisplayId}</p>
              </CardHeader>
              <span className="pr-4 text-xl font-bold text-gold">{entry.score ?? 0}</span>
            </Card>
          </li>
        ))}
        {entries.length === 0 && (
          <p className="text-cream/60">No public scores yet — be the first legend on the board.</p>
        )}
      </ol>
    </div>
  );
}
