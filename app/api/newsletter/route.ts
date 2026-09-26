import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import mongoose, { Schema } from "mongoose";

const bodySchema = z.object({
  email: z.string().email(),
});

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema);

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      await NewsletterSubscriber.findOneAndUpdate(
        { email: parsed.data.email.toLowerCase() },
        { $setOnInsert: { subscribedAt: new Date() } },
        { upsert: true, new: true }
      );
    } catch {
      // Store is best-effort; still return success for UX
    }

    return NextResponse.json({ success: true, message: "Thanks for subscribing!" });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
