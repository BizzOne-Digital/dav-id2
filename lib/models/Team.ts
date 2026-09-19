import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    color: {
      type: String,
      enum: ["BLUE", "GOLD", "GREEN", "PINK", "RED", "CYAN"],
      required: true,
    },
    number: { type: Number, required: true },
    displayId: { type: String, required: true, unique: true },
    captainId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    joinCode: { type: String, required: true, unique: true },
    playerCount: { type: Number, default: 4 },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  },
  { timestamps: true }
);

const TeamMemberSchema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    displayName: { type: String, required: true },
    role: { type: String, enum: ["captain", "player"], default: "player" },
    photoConsent: { type: Boolean, default: false },
    rulesAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export type ITeam = InferSchemaType<typeof TeamSchema> & { _id: string };
export type ITeamMember = InferSchemaType<typeof TeamMemberSchema> & { _id: string };

export const Team: Model<ITeam> = models.Team || model<ITeam>("Team", TeamSchema);
export const TeamMember: Model<ITeamMember> =
  models.TeamMember || model<ITeamMember>("TeamMember", TeamMemberSchema);
