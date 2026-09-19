import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const RouteStopSchema = new Schema(
  {
    order: Number,
    locationId: { type: Schema.Types.ObjectId, ref: "Location" },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge" },
    challengeVersion: Number,
    locationVersion: Number,
    status: {
      type: String,
      enum: ["locked", "active", "completed", "skipped", "replaced"],
      default: "locked",
    },
    estimatedArrival: Date,
  },
  { _id: false }
);

const GameSessionSchema = new Schema(
  {
    sessionCode: { type: String, required: true, unique: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    huntId: { type: Schema.Types.ObjectId, ref: "Hunt" },
    eventId: { type: Schema.Types.ObjectId, ref: "Event" },
    status: {
      type: String,
      enum: ["lobby", "active", "paused", "finished", "review"],
      default: "lobby",
    },
    groupType: String,
    score: { type: Number, default: 0 },
    completedStops: { type: Number, default: 0 },
    currentStopIndex: { type: Number, default: 0 },
    activeElapsedSeconds: { type: Number, default: 0 },
    pausedAt: Date,
    startedAt: Date,
    finishedAt: Date,
    routeSeed: String,
    ruleVersion: Number,
    wave: String,
    finalRankTitle: String,
  },
  { timestamps: true }
);

const RouteManifestSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "GameSession", required: true, unique: true },
    seed: { type: String, required: true },
    ruleVersion: { type: Number, default: 1 },
    stops: [RouteStopSchema],
    startLocationId: { type: Schema.Types.ObjectId, ref: "Location" },
    finishLocationId: { type: Schema.Types.ObjectId, ref: "Location" },
  },
  { timestamps: true }
);

export type IGameSession = InferSchemaType<typeof GameSessionSchema> & { _id: string };
export type IRouteManifest = InferSchemaType<typeof RouteManifestSchema> & { _id: string };

export const GameSession: Model<IGameSession> =
  models.GameSession || model<IGameSession>("GameSession", GameSessionSchema);
export const RouteManifest: Model<IRouteManifest> =
  models.RouteManifest || model<IRouteManifest>("RouteManifest", RouteManifestSchema);
