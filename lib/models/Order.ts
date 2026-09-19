import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const OrderSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    amountCents: { type: Number, required: true },
    taxCents: { type: Number, default: 0 },
    discountCents: { type: Number, default: 0 },
    currency: { type: String, default: "usd" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "disputed"],
      default: "pending",
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    manualPayment: { type: Boolean, default: false },
    manualPaymentNote: String,
    referralCode: String,
    promoCode: String,
    lineItems: [
      {
        label: String,
        quantity: Number,
        unitAmountCents: Number,
      },
    ],
  },
  { timestamps: true }
);

const PaymentEventSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    type: String,
    stripeEventId: { type: String, unique: true, sparse: true },
    payload: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const GameEntitlementSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
    token: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "used", "revoked"], default: "active" },
    validFrom: Date,
    validUntil: Date,
    usedAt: Date,
  },
  { timestamps: true }
);

export type IOrder = InferSchemaType<typeof OrderSchema> & { _id: string };
export type IPaymentEvent = InferSchemaType<typeof PaymentEventSchema> & { _id: string };
export type IGameEntitlement = InferSchemaType<typeof GameEntitlementSchema> & { _id: string };

export const Order: Model<IOrder> = models.Order || model<IOrder>("Order", OrderSchema);
export const PaymentEvent: Model<IPaymentEvent> =
  models.PaymentEvent || model<IPaymentEvent>("PaymentEvent", PaymentEventSchema);
export const GameEntitlement: Model<IGameEntitlement> =
  models.GameEntitlement || model<IGameEntitlement>("GameEntitlement", GameEntitlementSchema);
