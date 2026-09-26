import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Challenge } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";

const patchSchema = z.object({
  title: z.string().optional(),
  instructions: z.string().optional(),
  clue: z.string().optional(),
  answer: z.string().optional(),
  hint: z.string().optional(),
  basePoints: z.number().int().optional(),
  active: z.boolean().optional(),
  isPreviewSafe: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  const { id } = await context.params;
  const json: unknown = await request.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();
  const challenge = await Challenge.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!challenge) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, challenge });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  const { id } = await context.params;
  await connectDB();
  const challenge = await Challenge.findByIdAndDelete(id);
  if (!challenge) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
