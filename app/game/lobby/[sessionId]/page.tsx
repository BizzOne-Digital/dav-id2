import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Booking, GameSession } from "@/lib/models";
import { GameLobbyClient } from "@/components/game/GameLobbyClient";
import {
  formatPlayDeadline,
  isPlayWindowExpired,
  resolvePlayExpiresAt,
} from "@/lib/game/playWindow";

type PageProps = { params: Promise<{ sessionId: string }> };

export default async function GameLobbyPage({ params }: PageProps) {
  const { sessionId } = await params;
  await connectDB();

  const session = await GameSession.findById(sessionId).lean();
  if (!session) redirect("/dashboard");

  const booking = session.bookingId
    ? await Booking.findById(session.bookingId)
        .select("playExpiresAt updatedAt createdAt status")
        .lean()
    : null;
  const playExpiresAt = resolvePlayExpiresAt(session, booking);

  if (isPlayWindowExpired(playExpiresAt)) {
    redirect(`/game/expired?sessionId=${sessionId}`);
  }

  const playDeadlineLabel = playExpiresAt ? formatPlayDeadline(playExpiresAt) : null;

  return <GameLobbyClient sessionId={sessionId} playDeadlineLabel={playDeadlineLabel} />;
}
