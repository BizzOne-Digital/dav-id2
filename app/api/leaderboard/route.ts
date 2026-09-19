import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { LeaderboardEntry } from "@/lib/models";

const querySchema = z.object({
  scope: z.enum(["public", "private", "event"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      scope: searchParams.get("scope") ?? "public",
      limit: searchParams.get("limit") ?? 50,
    });
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid query" }, { status: 400 });
    }

    await connectDB();
    const entries = await LeaderboardEntry.find({
      scope: parsed.data.scope ?? "public",
      locked: { $ne: true },
    })
      .sort({ score: -1, completedStops: -1 })
      .limit(parsed.data.limit ?? 50)
      .lean();

    const ranked = entries.map((entry, index) => ({
      rank: index + 1,
      teamName: entry.teamName,
      teamDisplayId: entry.teamDisplayId,
      score: entry.score,
      completedStops: entry.completedStops,
      activeElapsedSeconds: entry.activeElapsedSeconds,
    }));

    return NextResponse.json({ success: true, entries: ranked });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
