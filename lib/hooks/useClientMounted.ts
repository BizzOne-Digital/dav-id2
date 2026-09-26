import { useSyncExternalStore } from "react";

/** True after client hydration — safe for portals without an effect. */
export function useClientMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
