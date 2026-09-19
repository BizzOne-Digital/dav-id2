import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Hunt } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { revalidatePublicSite } from "@/lib/site/revalidate-public";

const patchSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  featured: z.boolean().optional(),
  difficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
  coverImage: z.string().max(2048).optional().or(z.literal("")),
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
  const hunt = await Hunt.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!hunt) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  revalidatePublicSite();
  return NextResponse.json({ success: true, hunt });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  const { id } = await context.params;
  await connectDB();
  const hunt = await Hunt.findByIdAndDelete(id);
  if (!hunt) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  revalidatePublicSite();
  return NextResponse.json({ success: true });
}
