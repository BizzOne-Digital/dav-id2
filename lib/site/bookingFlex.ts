import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";

/** Stored on bookings — no fixed time-of-day slot; play starts when the group is ready. */
export const BOOKING_FLEXIBLE_START_WINDOW = "flexible";

export const BOOKING_PLAY_WINDOW_SUMMARY = `Play anytime within ${HUNT_PLAY_WINDOW_HOURS} hours of purchase—no scheduled time slot.`;

export function formatStartWindowLabel(value: string | undefined | null): string {
  if (!value || value === BOOKING_FLEXIBLE_START_WINDOW) {
    return `Flexible (${HUNT_PLAY_WINDOW_HOURS}h from purchase)`;
  }
  return value;
}
