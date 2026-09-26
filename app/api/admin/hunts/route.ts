import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Hunt } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { slugify } from "@/lib/utils";
import { revalidatePublicSite } from "@/lib/site/revalidate-public";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const hunts = await Hunt.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ success: true, hunts });
}

const createSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(120).optional(),
  shortDescription: z.string().max(500).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
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
  const slug = parsed.data.slug ?? slugify(parsed.data.title);
  const hunt = await Hunt.create({ ...parsed.data, slug });
  revalidatePublicSite();
  return NextResponse.json({ success: true, hunt }, { status: 201 });
}
