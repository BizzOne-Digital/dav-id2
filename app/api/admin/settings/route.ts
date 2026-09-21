import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { revalidatePublicSite } from "@/lib/site/revalidate-public";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const settings = await SiteSettings.findOne({ key: "default" }).lean();
  return NextResponse.json({ success: true, settings });
}

const heroPatchSchema = z.object({
  headline: z.string().max(300).optional(),
  subheadline: z.string().max(1200).optional(),
  ctaPrimary: z.string().max(120).optional(),
  ctaSecondary: z.string().max(120).optional(),
  backgroundImage: z.string().max(2048).optional().or(z.literal("")),
});

const offerSlotSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(800).optional(),
  note: z.string().max(400).optional(),
  published: z.boolean().optional(),
  comingSoon: z.boolean().optional(),
});

const inGameOffersPatchSchema = z.object({
  heading: z.string().max(200).optional(),
  subtitle: z.string().max(800).optional(),
  discounts: offerSlotSchema.optional(),
  coupons: offerSlotSchema.optional(),
  prizes: offerSlotSchema.optional(),
});

const socialLinksPatchSchema = z.object({
  facebook: z.string().max(500).optional().or(z.literal("")),
  instagram: z.string().max(500).optional().or(z.literal("")),
  tiktok: z.string().max(500).optional().or(z.literal("")),
  youtube: z.string().max(500).optional().or(z.literal("")),
  twitter: z.string().max(500).optional().or(z.literal("")),
});

const patchSchema = z.object({
  businessName: z.string().max(200).optional(),
  tagline: z.string().max(300).optional(),
  phone: z.string().max(40).optional(),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  domain: z.string().max(200).optional(),
  logoUrl: z.string().max(2048).optional().or(z.literal("")),
  footerText: z.string().max(1000).optional(),
  newsletterHeading: z.string().max(200).optional(),
  typicalDurationHours: z.string().max(40).optional(),
  minimumPlayers: z.number().int().min(1).optional(),
  defaultPricePerPersonCents: z.number().int().min(0).optional(),
  hero: heroPatchSchema.optional(),
  inGameOffers: inGameOffersPatchSchema.optional(),
  socialLinks: socialLinksPatchSchema.optional(),
});

export async function PATCH(request: Request) {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  const json: unknown = await request.json();
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();

  const { hero, inGameOffers, socialLinks, ...rest } = parsed.data;
  const $set: Record<string, unknown> = { ...rest };
  if (hero) {
    for (const [key, value] of Object.entries(hero)) {
      if (value !== undefined) {
        $set[`hero.${key}`] = value;
      }
    }
  }
  if (inGameOffers) {
    for (const [key, value] of Object.entries(inGameOffers)) {
      if (value === undefined) continue;
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        for (const [subKey, subVal] of Object.entries(value)) {
          if (subVal !== undefined) {
            $set[`inGameOffers.${key}.${subKey}`] = subVal;
          }
        }
      } else {
        $set[`inGameOffers.${key}`] = value;
      }
    }
  }

  if (socialLinks) {
    for (const [key, value] of Object.entries(socialLinks)) {
      if (value !== undefined) {
        $set[`socialLinks.${key}`] = value;
      }
    }
  }

  const settings = await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $set },
    { new: true, upsert: true }
  ).lean();

  revalidatePublicSite();

  return NextResponse.json({ success: true, settings });
}
