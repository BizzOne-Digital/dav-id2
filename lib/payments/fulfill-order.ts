import { connectDB } from "@/lib/db/connect";
import {
  Booking,
  Order,
  GameEntitlement,
  GameSession,
  Team,
  User,
} from "@/lib/models";
import mongoose from "mongoose";
import {
  generateEntitlementToken,
  generateJoinCode,
  generateSessionCode,
} from "@/lib/utils";

export type FulfillOrderInput = {
  bookingId: string;
  amountCents: number;
  taxCents?: number;
  discountCents?: number;
  currency?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  userId?: string;
  lineItems?: { label: string; quantity: number; unitAmountCents: number }[];
};

export type FulfillOrderResult = {
  orderId: string;
  entitlementToken: string;
  sessionCode: string;
  teamDisplayId: string;
};

function asObjectId(value: unknown): mongoose.Types.ObjectId | undefined {
  if (!value) return undefined;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  return undefined;
}

export async function fulfillOrder(input: FulfillOrderInput): Promise<FulfillOrderResult> {
  await connectDB();

  const booking = await Booking.findById(input.bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  let order =
    input.stripeSessionId != null
      ? await Order.findOne({ stripeSessionId: input.stripeSessionId }).exec()
      : null;
  if (!order) {
    order = await Order.create({
      bookingId: booking._id,
      userId: input.userId ?? booking.userId,
      amountCents: input.amountCents,
      taxCents: input.taxCents ?? 0,
      discountCents: input.discountCents ?? 0,
      currency: input.currency ?? "usd",
      paymentStatus: "paid",
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId,
      lineItems: input.lineItems ?? [],
    });
  } else if (order.paymentStatus !== "paid") {
    order.paymentStatus = "paid";
    if (input.stripePaymentIntentId) {
      order.stripePaymentIntentId = input.stripePaymentIntentId;
    }
    await order.save();
  }

  let entitlement = await GameEntitlement.findOne({ orderId: order._id }).exec();
  if (!entitlement) {
    entitlement = await GameEntitlement.create({
      orderId: order._id,
      bookingId: booking._id,
      teamId: booking.teamId,
      token: generateEntitlementToken(),
      status: "active",
      validFrom: new Date(),
    });
  }

  let teamId: mongoose.Types.ObjectId | undefined = asObjectId(booking.teamId);
  if (!teamId) {
    let captainId: mongoose.Types.ObjectId | undefined =
      asObjectId(booking.userId) ??
      (input.userId ? new mongoose.Types.ObjectId(input.userId) : undefined);
    if (!captainId && booking.captainEmail) {
      const captain = await User.findOne({ email: booking.captainEmail.toLowerCase() });
      captainId = asObjectId(captain?._id);
    }
    if (!captainId) {
      const placeholder = await User.findOne({ email: "placeholder@captain.local" });
      captainId = asObjectId(placeholder?._id);
    }
    if (!captainId) {
      throw new Error("Cannot create game session without a captain user");
    }

    const teamNumber = (await Team.countDocuments()) + 1;
    const displayId = `NSH-${String(teamNumber).padStart(4, "0")}`;
    const team = await Team.create({
      name: booking.teamName ?? "Hunt Team",
      color: (booking.teamColor as "BLUE" | "GOLD" | "GREEN" | "PINK" | "RED" | "CYAN") ?? "GOLD",
      number: teamNumber,
      displayId,
      captainId,
      joinCode: generateJoinCode(),
      playerCount: booking.playerCount,
      bookingId: booking._id,
    });
    teamId = asObjectId(team._id);
    if (!teamId) {
      throw new Error("Failed to create team");
    }
    booking.set("teamId", teamId);
    entitlement.teamId = teamId;
    await Promise.all([booking.save(), entitlement.save()]);
  }

  if (!teamId) {
    throw new Error("Team is required to start a game session");
  }

  let session = await GameSession.findOne({ bookingId: booking._id }).exec();
  if (!session) {
    session = await GameSession.create({
      sessionCode: generateSessionCode(),
      teamId,
      bookingId: booking._id,
      huntId: booking.huntId,
      status: "lobby",
      groupType: booking.groupType,
    });
  }

  if (booking.status !== "confirmed" && booking.status !== "completed") {
    booking.status = "confirmed";
    await booking.save();
  }

  const team = await Team.findById(teamId).lean();
  return {
    orderId: order._id.toString(),
    entitlementToken: entitlement.token,
    sessionCode: session.sessionCode,
    teamDisplayId: team?.displayId ?? "",
  };
}
