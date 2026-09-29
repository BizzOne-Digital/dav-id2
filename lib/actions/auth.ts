import bcrypt from "bcryptjs";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { Booking, Team } from "@/lib/models";

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().max(30).optional(),
  marketing: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type RegisterResult =
  | { success: true; userId: string }
  | { success: false; error: string };

export async function createRegisteredUser(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, phone, marketing } = parsed.data;
  await connectDB();

  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing?.passwordHash) {
    return { success: false, error: "An account with this email already exists" };
  }

  try {
    let userId: string;
    if (existing) {
      existing.name = name;
      existing.passwordHash = passwordHash;
      if (phone) existing.phone = phone;
      existing.consent = {
        marketing: marketing ?? existing.consent?.marketing ?? false,
        photoSharing: existing.consent?.photoSharing ?? false,
        emergencyContact: existing.consent?.emergencyContact ?? false,
      };
      await existing.save();
      userId = existing._id.toString();
    } else {
      const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash,
        phone,
        role: "customer",
        consent: { marketing: marketing ?? false },
      });
      userId = user._id.toString();
    }

    const captainOid = new mongoose.Types.ObjectId(userId);
    const bookingIds = await Booking.find({ captainEmail: normalizedEmail }).distinct("_id");
    if (bookingIds.length) {
      await Booking.updateMany({ _id: { $in: bookingIds } }, { $set: { userId: captainOid } });
      await Team.updateMany({ bookingId: { $in: bookingIds } }, { $set: { captainId: captainOid } });
    }

    return { success: true, userId };
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code?: number }).code : undefined;
    if (code === 11000) {
      return { success: false, error: "An account with this email already exists" };
    }
    throw err;
  }
}

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  "use server";

  return createRegisteredUser({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    phone: formData.get("phone") ? String(formData.get("phone")) : undefined,
    marketing: formData.get("marketing") === "on" || formData.get("marketing") === "true",
  });
}
