export const HUNT_PASS_STORAGE_KEY = "mcs_hunt_pass";

export type HuntPass = {
  bookingId: string;
  sessionId: string;
  joinCode: string;
  teamName?: string;
  savedAt: number;
};

export function saveHuntPass(pass: Omit<HuntPass, "savedAt">) {
  if (typeof window === "undefined") return;
  const payload: HuntPass = { ...pass, savedAt: Date.now() };
  window.localStorage.setItem(HUNT_PASS_STORAGE_KEY, JSON.stringify(payload));
}

export function readHuntPass(): HuntPass | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(HUNT_PASS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HuntPass;
    if (!parsed.bookingId || !parsed.sessionId || !parsed.joinCode) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearHuntPass() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HUNT_PASS_STORAGE_KEY);
}
