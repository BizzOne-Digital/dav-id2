/** Time allowed to join, play, and finish after purchase (weekend / long-weekend trips). */
export const HUNT_PLAY_WINDOW_HOURS = 72;

export const HUNT_PLAY_WINDOW_MS = HUNT_PLAY_WINDOW_HOURS * 60 * 60 * 1000;

export const PLAY_WINDOW_EXPIRED_MESSAGE =
  "This join code has expired. You have 72 hours from purchase to play and finish—book again to start a new hunt.";

export function computePlayExpiresAt(from: Date = new Date()): Date {
  return new Date(from.getTime() + HUNT_PLAY_WINDOW_MS);
}

type PlayWindowBooking = {
  playExpiresAt?: Date | string | null;
  updatedAt?: Date | string;
  createdAt?: Date | string;
  status?: string;
} | null;

type PlayWindowSession = {
  playExpiresAt?: Date | string | null;
};

export function resolvePlayExpiresAt(
  session: PlayWindowSession,
  booking?: PlayWindowBooking
): Date | null {
  if (session.playExpiresAt) return new Date(session.playExpiresAt);
  if (booking?.playExpiresAt) return new Date(booking.playExpiresAt);
  if (
    booking &&
    (booking.status === "confirmed" || booking.status === "completed")
  ) {
    const anchor = booking.updatedAt ?? booking.createdAt;
    if (anchor) return computePlayExpiresAt(new Date(anchor));
  }
  return null;
}

export function isPlayWindowExpired(
  expiresAt: Date | null | undefined,
  now: Date = new Date()
): boolean {
  if (!expiresAt) return false;
  return now.getTime() > expiresAt.getTime();
}

export function formatPlayDeadline(expiresAt: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(expiresAt);
}
