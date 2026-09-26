import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const LeaderboardEntrySchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession" },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    teamName: String,
    teamDisplayId: String,
    score: { type: Number, default: 0 },
    completedStops: { type: Number, default: 0 },
    activeElapsedSeconds: { type: Number, default: 0 },
    rank: Number,
    scope: { type: String, enum: ["public", "private", "event"], default: "public" },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    locked: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CertificateSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    certificateId: { type: String, required: true, unique: true },
    teamName: String,
    finalScore: Number,
    rankTitle: String,
    rank: Number,
    pdfUrl: String,
    verificationSlug: { type: String, unique: true },
  },
  { timestamps: true }
);

export type ILeaderboardEntry = InferSchemaType<typeof LeaderboardEntrySchema> & { _id: string };
export type ICertificate = InferSchemaType<typeof CertificateSchema> & { _id: string };

export const LeaderboardEntry: Model<ILeaderboardEntry> =
  models.LeaderboardEntry || model<ILeaderboardEntry>("LeaderboardEntry", LeaderboardEntrySchema);
export const Certificate: Model<ICertificate> =
  models.Certificate || model<ICertificate>("Certificate", CertificateSchema);
