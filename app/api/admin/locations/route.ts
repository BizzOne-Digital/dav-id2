import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Location } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { slugify } from "@/lib/utils";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const locations = await Location.find().sort({ name: 1 }).lean();
  return NextResponse.json({ success: true, locations });
}

const createSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().optional(),
  category: z.enum(["landmark", "history", "retail", "food", "scenic", "music", "partner"]),
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
  status: z.enum(["active", "closed", "crowded", "suppressed"]).optional(),
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
  const slug = parsed.data.slug ?? slugify(parsed.data.name);
  const location = await Location.create({ ...parsed.data, slug });
  return NextResponse.json({ success: true, location }, { status: 201 });
}
