import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const AuditLogSchema = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    staffEmail: String,
    action: { type: String, required: true },
    resource: String,
    resourceId: String,
    previousValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
    reason: String,
  },
  { timestamps: true }
);

const PromoCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ["percent", "fixed"], default: "percent" },
    discountValue: Number,
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    expiresAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ReferralSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    captainId: { type: Schema.Types.ObjectId, ref: "User" },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    friendDiscountPercent: { type: Number, default: 10 },
    captainCreditCents: { type: Number, default: 1000 },
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    expiresAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SupportTicketSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession" },
    subject: String,
    message: String,
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    priority: { type: String, enum: ["low", "normal", "high", "emergency"], default: "normal" },
  },
  { timestamps: true }
);

const MediaAssetSchema = new Schema(
  {
    publicId: String,
    url: { type: String, required: true },
    alt: String,
    caption: String,
    category: String,
    mimeType: String,
    bytes: Number,
  },
  { timestamps: true }
);

const EventSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ["scheduled", "live", "completed", "cancelled"], default: "scheduled" },
  },
  { timestamps: true }
);

const PartnerSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    locationId: { type: Schema.Types.ObjectId, ref: "Location" },
    contactEmail: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PartnerOfferSchema = new Schema(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true },
    title: String,
    terms: String,
    redemptionCode: String,
    validFrom: Date,
    validUntil: Date,
    inventory: Number,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SurveySchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession" },
    overallRating: Number,
    puzzleQuality: Number,
    routeClarity: Number,
    locationAccessible: Boolean,
    confusedBy: String,
    screenshotUrl: String,
  },
  { timestamps: true }
);

const IssueReportSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession" },
    locationId: { type: Schema.Types.ObjectId, ref: "Location" },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge" },
    category: { type: String, enum: ["safety", "closure", "clue", "app", "partner"] },
    message: String,
    status: { type: String, enum: ["flagged", "triaged", "corrected", "published"], default: "flagged" },
  },
  { timestamps: true }
);

export type IAuditLog = InferSchemaType<typeof AuditLogSchema> & { _id: string };

export const AuditLog: Model<IAuditLog> = models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
export const PromoCode = models.PromoCode || model("PromoCode", PromoCodeSchema);
export const Referral = models.Referral || model("Referral", ReferralSchema);
export const SupportTicket = models.SupportTicket || model("SupportTicket", SupportTicketSchema);
export const MediaAsset = models.MediaAsset || model("MediaAsset", MediaAssetSchema);
export const Event = models.Event || model("Event", EventSchema);
export const Partner = models.Partner || model("Partner", PartnerSchema);
export const PartnerOffer = models.PartnerOffer || model("PartnerOffer", PartnerOfferSchema);
export const Survey = models.Survey || model("Survey", SurveySchema);
export const IssueReport = models.IssueReport || model("IssueReport", IssueReportSchema);
