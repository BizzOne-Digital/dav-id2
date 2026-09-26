import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { FAQ, Testimonial } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { revalidatePublicSite } from "@/lib/site/revalidate-public";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const [faqs, testimonials] = await Promise.all([
    FAQ.find().sort({ order: 1 }).lean(),
    Testimonial.find().sort({ order: 1 }).lean(),
  ]);
  return NextResponse.json({ success: true, faqs, testimonials });
}

const bodySchema = z.object({
  type: z.enum(["faq", "testimonial"]),
  action: z.enum(["create", "update", "delete"]),
  id: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  const json: unknown = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();
  const { type, action, id, data } = parsed.data;

  if (type === "faq") {
    if (action === "create") {
      const faq = await FAQ.create(data ?? {});
      revalidatePublicSite();
      return NextResponse.json({ success: true, faq });
    }
    if (action === "update" && id) {
      const faq = await FAQ.findByIdAndUpdate(id, { $set: data }, { new: true });
      revalidatePublicSite();
      return NextResponse.json({ success: true, faq });
    }
    if (action === "delete" && id) {
      await FAQ.findByIdAndDelete(id);
      revalidatePublicSite();
      return NextResponse.json({ success: true });
    }
  }

  if (type === "testimonial") {
    if (action === "create") {
      const testimonial = await Testimonial.create(data ?? {});
      revalidatePublicSite();
      return NextResponse.json({ success: true, testimonial });
    }
    if (action === "update" && id) {
      const testimonial = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true });
      revalidatePublicSite();
      return NextResponse.json({ success: true, testimonial });
    }
    if (action === "delete" && id) {
      await Testimonial.findByIdAndDelete(id);
      revalidatePublicSite();
      return NextResponse.json({ success: true });
    }
  }

  return NextResponse.json({ success: false, error: "Invalid operation" }, { status: 400 });
}
