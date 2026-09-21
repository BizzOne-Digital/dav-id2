import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const LocationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["landmark", "history", "retail", "food", "scenic", "music", "partner"],
      required: true,
    },
    categoryLabel: String,
    masterId: { type: Number, index: true },
    description: String,
    address: String,
    phone: String,
    website: String,
    accessAgeProfile: String,
    audienceFit: String,
    routeNotes: String,
    sampleChallenge: String,
    partnerPrizeIdea: String,
    verificationNote: String,
    priority: { type: String, enum: ["high", "medium"], default: "medium" },
    gameStopEligible: { type: Boolean, default: true },
    purchaseRequired: { type: Boolean, default: false },
    alcoholRequired: { type: Boolean, default: false },
    partnerConfirmed: { type: Boolean, default: false },
    geocodeStatus: { type: String, enum: ["pending", "verified"], default: "pending" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    geofenceRadiusM: { type: Number, default: 40 },
    tags: [String],
    audienceTags: [String],
    ageMin: { type: Number, default: 0 },
    adultOnlyInterior: { type: Boolean, default: false },
    alcoholVenue: { type: Boolean, default: false },
    accessibilityTags: [String],
    indoor: Boolean,
    outdoor: { type: Boolean, default: true },
    operatingHours: Schema.Types.Mixed,
    blackoutDates: [Date],
    weatherSuitability: { type: String, enum: ["all", "fair", "indoor_fallback"], default: "all" },
    maxTeamsPerSlot: { type: Number, default: 3 },
    partnerPermission: { type: Boolean, default: true },
    partnerPriority: { type: Number, default: 5 },
    status: { type: String, enum: ["active", "closed", "crowded", "suppressed"], default: "active" },
    zone: { type: String, enum: ["A", "B", "C", "D", "partner"], default: "A" },
    image: String,
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export type ILocation = InferSchemaType<typeof LocationSchema> & { _id: string };

export const Location: Model<ILocation> = models.Location || model<ILocation>("Location", LocationSchema);
