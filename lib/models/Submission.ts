import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const SubmissionSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    stopIndex: Number,
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge" },
    answer: String,
    evidenceUrl: String,
    evidenceHash: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "review"],
      default: "pending",
    },
    pointsAwarded: Number,
    attempts: { type: Number, default: 0 },
    hintUsed: { type: Boolean, default: false },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User" },
    reviewNote: String,
  },
  { timestamps: true }
);

const CompletionSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    stopIndex: Number,
    locationId: { type: Schema.Types.ObjectId, ref: "Location" },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge" },
    challengeVersion: Number,
    displayNumber: { type: String, required: true },
    signature: { type: String, required: true },
    points: Number,
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CompletionSchema.index({ displayNumber: 1, sessionId: 1 }, { unique: true });

export type ISubmission = InferSchemaType<typeof SubmissionSchema> & { _id: string };
export type ICompletion = InferSchemaType<typeof CompletionSchema> & { _id: string };

export const Submission: Model<ISubmission> =
  models.Submission || model<ISubmission>("Submission", SubmissionSchema);
export const Completion: Model<ICompletion> =
  models.Completion || model<ICompletion>("Completion", CompletionSchema);
