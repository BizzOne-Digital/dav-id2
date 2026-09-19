import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { isAdminRole } from "@/lib/constants/roles";
import type { Session } from "next-auth";

type AdminResult =
  | { session: Session; error?: undefined }
  | { session?: undefined; error: NextResponse };

export async function requireAdminApi(): Promise<AdminResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!isAdminRole(session.user.role)) {
    return {
      error: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session };
}
