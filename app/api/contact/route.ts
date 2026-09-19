import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS ?? process.env.GMAIL_APP_PASSWORD;
    const contactTo = process.env.CONTACT_TO_EMAIL ?? process.env.GMAIL_USER;

    if (gmailUser && gmailPass && contactTo) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });

      await transporter.sendMail({
        from: gmailUser,
        to: contactTo,
        replyTo: email,
        subject: `[Contact] ${subject}`,
        text: `From: ${name} <${email}>${phone ? `\nPhone: ${phone}` : ""}\n\n${message}`,
      });
    } else {
      console.info("[contact]", { name, email, phone, subject, message });
    }

    return NextResponse.json({ success: true, message: "Message received. We will reply soon." });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
