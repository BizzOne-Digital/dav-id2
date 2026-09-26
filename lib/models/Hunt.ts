import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const HuntSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    fullDescription: String,
    coverImage: String,
    gallery: [String],
    priceType: { type: String, enum: ["per_person", "flat", "contact"], default: "per_person" },
    pricePerPersonCents: Number,
    flatPriceCents: Number,
    minimumPlayers: { type: Number, default: 1 },
    maximumPlayers: Number,
    duration: { type: String, default: "2–3 hours" },
    difficulty: { type: String, enum: ["easy", "moderate", "challenging"], default: "moderate" },
    walkingDistance: String,
    ageRestrictions: String,
    accessibilityDetails: String,
    alcoholFreeAvailable: { type: Boolean, default: true },
    includedRewards: [String],
    groupTypes: [String],
    availableDates: [Date],
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
    featured: { type: Boolean, default: false },
    seoTitle: String,
    seoDescription: String,
    pricingPlanId: { type: Schema.Types.ObjectId, ref: "PricingPlan" },
  },
  { timestamps: true }
);

export type IHunt = InferSchemaType<typeof HuntSchema> & { _id: string };

export const Hunt: Model<IHunt> = models.Hunt || model<IHunt>("Hunt", HuntSchema);
