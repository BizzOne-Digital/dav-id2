import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Challenge } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const challenges = await Challenge.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ success: true, challenges });
}

const challengeTypes = [
  "text",
  "multiple_choice",
  "riddle",
  "trivia",
  "observation",
  "cipher",
  "sequence",
  "map_deduction",
  "gps",
  "partner_qr",
  "photo",
  "video",
  "facilitator",
  "hybrid",
] as const;

const createSchema = z.object({
  locationId: z.string().min(1),
  type: z.enum(challengeTypes),
  instructions: z.string().min(1),
  title: z.string().optional(),
  clue: z.string().optional(),
  answer: z.string().optional(),
  basePoints: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  const json: unknown = await request.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();
  const challenge = await Challenge.create(parsed.data);
  return NextResponse.json({ success: true, challenge }, { status: 201 });
}
