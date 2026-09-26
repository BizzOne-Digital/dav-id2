import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ChallengeSchema = new Schema(
  {
    locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    version: { type: Number, default: 1 },
    type: {
      type: String,
      enum: [
        "text",
        "multiple_choice",
        "riddle",
        "trivia",
        "observation",
        "cipher",
        "sequence",
        "map_deduction",
        "gps",
        "partner_qr",
        "photo",
        "video",
        "facilitator",
        "hybrid",
      ],
      required: true,
    },
    audienceTags: [String],
    difficulty: { type: String, enum: ["easy", "moderate", "hard"], default: "moderate" },
    title: String,
    instructions: { type: String, required: true },
    clue: String,
    options: [String],
    answer: String,
    acceptedVariants: [String],
    hint: String,
    hintPenalty: { type: Number, default: 50 },
    basePoints: { type: Number, default: 300 },
    bonusPoints: { type: Number, default: 0 },
    attemptLimit: { type: Number, default: 5 },
    verificationMethod: {
      type: String,
      enum: ["answer", "gps", "partner_qr", "photo", "video", "facilitator", "hybrid"],
      default: "answer",
    },
    minDwellSeconds: { type: Number, default: 0 },
    mediaConsentRequired: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    isSample: { type: Boolean, default: false },
    isPreviewSafe: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type IChallenge = InferSchemaType<typeof ChallengeSchema> & { _id: string };

export const Challenge: Model<IChallenge> =
  models.Challenge || model<IChallenge>("Challenge", ChallengeSchema);
