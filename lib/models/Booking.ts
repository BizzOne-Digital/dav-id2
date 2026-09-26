import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    huntId: { type: Schema.Types.ObjectId, ref: "Hunt", required: true },
    groupType: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    startWindow: { type: String, required: true },
    playerCount: { type: Number, required: true },
    youngestAge: Number,
    accessibilityNotes: String,
    alcoholFree: { type: Boolean, default: false },
    indoorOutdoorPref: String,
    walkingPref: String,
    startArea: String,
    finishArea: String,
    teamName: String,
    captainName: String,
    captainEmail: String,
    captainPhone: String,
    teamColor: String,
    emergencyConsent: { type: Boolean, default: false },
    referralCode: String,
    promoCode: String,
    status: {
      type: String,
      enum: ["draft", "pending_payment", "confirmed", "cancelled", "completed"],
      default: "draft",
    },
    bookingReference: { type: String, unique: true, sparse: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    idempotencyKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export type IBooking = InferSchemaType<typeof BookingSchema> & { _id: string };

export const Booking: Model<IBooking> = models.Booking || model<IBooking>("Booking", BookingSchema);
