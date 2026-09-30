import { isAdminRole } from "@/lib/constants/roles";
import type { Role } from "@/lib/constants/roles";

export function normalizeJoinCode(raw: string): string {
  return raw.replace(/\s/g, "").toUpperCase();
}

/** Captain may start from account login or by proving the team join code (guest checkout). */
export function canCaptainStartSession(input: {
  userId?: string | null;
  userRole?: Role | string | null;
  teamCaptainId?: string | null;
  teamJoinCode?: string | null;
  providedJoinCode?: string | null;
}): boolean {
  if (input.userId && input.teamCaptainId && input.userId === input.teamCaptainId.toString()) {
    return true;
  }
  if (input.userRole && isAdminRole(input.userRole)) {
    return true;
  }
  if (input.providedJoinCode && input.teamJoinCode) {
    return normalizeJoinCode(input.providedJoinCode) === normalizeJoinCode(input.teamJoinCode);
  }
  return false;
}
