import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    businessName: { type: String, default: "Nashville Scavenger Hunt" },
    tagline: { type: String, default: "Explore. Discover. Compete. Create Memories." },
    phone: { type: String, default: "615-571-9900" },
    email: { type: String, default: "howigetemail@gmail.com" },
    domain: { type: String, default: "NashvilleScavengerHunt.com" },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    brandColors: {
      charcoal: { type: String, default: "#101216" },
      cream: { type: String, default: "#F6E8CB" },
      gold: { type: String, default: "#F2B632" },
      orange: { type: String, default: "#D76A26" },
      crimson: { type: String, default: "#A93226" },
      denim: { type: String, default: "#255C85" },
      olive: { type: String, default: "#75833D" },
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      tiktok: String,
      youtube: String,
    },
    hero: {
      headline: String,
      subheadline: String,
      ctaPrimary: { type: String, default: "Book Your Hunt" },
      ctaSecondary: { type: String, default: "Preview a Challenge" },
      backgroundImage: String,
    },
    pricingPlanId: { type: Schema.Types.ObjectId, ref: "PricingPlan" },
    defaultPricePerPersonCents: { type: Number, default: 2995 },
    volumePricePerPersonCents: { type: Number, default: 2500 },
    volumeMinPlayers: { type: Number, default: 10 },
    minimumPlayers: { type: Number, default: 4 },
    typicalDurationHours: { type: String, default: "2–3" },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      ogImage: String,
    },
    stats: [{ label: String, value: String, isSample: { type: Boolean, default: true } }],
    newsletterHeading: String,
    footerText: String,
    inGameOffers: {
      heading: String,
      subtitle: String,
      discounts: {
        title: String,
        description: String,
        note: String,
        published: { type: Boolean, default: true },
        comingSoon: { type: Boolean, default: true },
      },
      coupons: {
        title: String,
        description: String,
        note: String,
        published: { type: Boolean, default: true },
        comingSoon: { type: Boolean, default: true },
      },
      prizes: {
        title: String,
        description: String,
        note: String,
        published: { type: Boolean, default: true },
        comingSoon: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

export type ISiteSettings = InferSchemaType<typeof SiteSettingsSchema> & { _id: string };

export const SiteSettings: Model<ISiteSettings> =
  models.SiteSettings || model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
