import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/models/User";

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

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone,
    role: "customer",
    consent: { marketing: marketing ?? false },
  });

  return { success: true, userId: user._id.toString() };
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
