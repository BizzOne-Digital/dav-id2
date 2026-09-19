import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const PricingPlanSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    pricePerPersonCents: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    minimumPlayers: { type: Number, default: 4 },
    maximumPlayers: { type: Number },
    durationLabel: { type: String, default: "2–3 hours" },
    features: [String],
    isDefault: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    priceType: { type: String, enum: ["per_person", "flat", "contact"], default: "per_person" },
    description: String,
  },
  { timestamps: true }
);

export type IPricingPlan = InferSchemaType<typeof PricingPlanSchema> & { _id: string };

export const PricingPlan: Model<IPricingPlan> =
  models.PricingPlan || model<IPricingPlan>("PricingPlan", PricingPlanSchema);
