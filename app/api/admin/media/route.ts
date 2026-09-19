import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { MediaAsset } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const assets = await MediaAsset.find().sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ success: true, assets });
}

const createSchema = z.object({
  url: z.string().min(1).max(2048),
  alt: z.string().optional(),
  caption: z.string().optional(),
  category: z.string().optional(),
  publicId: z.string().optional(),
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
  const asset = await MediaAsset.create(parsed.data);
  return NextResponse.json({ success: true, asset }, { status: 201 });
}
