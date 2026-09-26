import { NextResponse } from "next/server";
import { missingServerEnv } from "@/lib/env/required";

export const runtime = "nodejs";

/** Public check for whether auth can work (no secrets exposed). */
export async function GET() {
  const missing = missingServerEnv(["MONGODB_URI", "AUTH_SECRET"]);
  const isProd = process.env.NODE_ENV === "production";
  return NextResponse.json({
    ok: missing.length === 0,
    ...(isProd ? {} : { missing }),
  });
}
