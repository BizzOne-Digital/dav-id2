import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Location } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { revalidatePublicSite } from "@/lib/site/revalidate-public";

const patchSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  category: z.enum(["landmark", "history", "retail", "food", "scenic", "music", "partner"]).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "closed", "crowded", "suppressed"]).optional(),
  description: z.string().optional(),
  image: z.string().max(2048).optional().or(z.literal("")),
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
  const location = await Location.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean();
  if (!location) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  revalidatePublicSite();
  return NextResponse.json({ success: true, location });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  const { id } = await context.params;
  await connectDB();
  const location = await Location.findByIdAndDelete(id);
  if (!location) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
