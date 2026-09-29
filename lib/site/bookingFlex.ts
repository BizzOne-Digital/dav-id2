import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";

/** Stored on bookings — no fixed time-of-day slot; play starts when the group is ready. */
export const BOOKING_FLEXIBLE_START_WINDOW = "flexible";

/** Shown on booking step 1 — clarifies advance trip planning vs. when the clock starts */
export const BOOKING_PLAY_WINDOW_SUMMARY = `Buy when you are ready to play: your ${HUNT_PLAY_WINDOW_HOURS}-hour window begins at checkout (not on a future visit date). Optional visit date is for our planning only.`;

export const BOOKING_PLANNED_DATE_HINT =
  "Planning a trip next month? Wait to checkout until you are within a few days of play—or contact us for group events.";

export function formatStartWindowLabel(value: string | undefined | null): string {
  if (!value || value === BOOKING_FLEXIBLE_START_WINDOW) {
    return `Flexible (${HUNT_PLAY_WINDOW_HOURS}h from checkout)`;
  }
  return value;
}
