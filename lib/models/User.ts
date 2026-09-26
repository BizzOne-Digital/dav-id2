import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { ROLES } from "@/lib/constants/roles";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ROLES, default: "customer" },
    emailVerified: { type: Date },
    phone: { type: String },
    image: { type: String },
    consent: {
      marketing: { type: Boolean, default: false },
      photoSharing: { type: Boolean, default: false },
      emergencyContact: { type: Boolean, default: false },
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    verifyToken: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export type IUser = InferSchemaType<typeof UserSchema> & { _id: string };

export const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);
