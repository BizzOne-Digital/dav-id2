export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Booking, GameSession, RouteManifest, Team, Location, Challenge } from "@/lib/models";
import { GamePlayClient } from "@/components/game/GamePlayClient";
import { isPlayWindowExpired, resolvePlayExpiresAt } from "@/lib/game/playWindow";

type PageProps = { params: Promise<{ sessionId: string }> };

export default async function GamePlayPage({ params }: PageProps) {
  const { sessionId } = await params;
  await connectDB();

  const session = await GameSession.findById(sessionId).lean();
  if (!session) redirect("/dashboard");

  const booking = session.bookingId
    ? await Booking.findById(session.bookingId)
        .select("playExpiresAt updatedAt createdAt status")
        .lean()
    : null;
  if (isPlayWindowExpired(resolvePlayExpiresAt(session, booking))) {
    redirect(`/game/expired?sessionId=${sessionId}`);
  }

  if (session.status === "lobby") redirect(`/game/lobby/${sessionId}`);
  if (session.status === "finished") redirect(`/game/finish/${sessionId}`);

  const manifest = await RouteManifest.findOne({ sessionId: session._id }).lean();
  if (!manifest?.stops?.length) redirect(`/game/lobby/${sessionId}`);

  const stopIndex = session.currentStopIndex ?? 0;
  const routeStop = manifest.stops[stopIndex];
  if (!routeStop || routeStop.status === "completed") {
    const nextOpen = manifest.stops.findIndex((s) => s.status === "active");
    if (nextOpen === -1) redirect(`/game/finish/${sessionId}`);
  }

  const activeIndex =
    routeStop?.status === "active"
      ? stopIndex
      : manifest.stops.findIndex((s) => s.status === "active");

  if (activeIndex < 0) redirect(`/game/finish/${sessionId}`);

  const activeStop = manifest.stops[activeIndex];
  const [location, challenge, team] = await Promise.all([
    Location.findById(activeStop.locationId).lean(),
    activeStop.challengeId ? Challenge.findById(activeStop.challengeId).lean() : null,
    Team.findById(session.teamId).lean(),
  ]);

  if (!location || !challenge) {
    return (
      <div className="p-8 text-center text-cream/70">
        Challenge data missing for this stop. Contact support.
      </div>
    );
  }

  return (
    <GamePlayClient
      sessionId={sessionId}
      teamName={team?.name ?? "Team"}
      sessionCode={session.sessionCode}
      score={session.score ?? 0}
      stop={{
        stopIndex: activeIndex,
        totalStops: manifest.stops.length,
        locationName: location.name,
        address: location.address ?? undefined,
        lat: location.lat,
        lng: location.lng,
        clue: challenge.clue ?? undefined,
        instructions: challenge.instructions,
        challengeTitle: challenge.title ?? undefined,
        basePoints: challenge.basePoints ?? 300,
      }}
    />
  );
}
