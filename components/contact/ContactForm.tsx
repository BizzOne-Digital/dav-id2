"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

type ContactFormProps = {
  defaultEmail?: string;
};

export function ContactForm({ defaultEmail }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, subject, message }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to send");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-cream/80">Name</label>
          <Input variant="light" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-cream/80">Email</label>
          <Input variant="light" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-cream/80">Phone (optional)</label>
        <Input variant="light" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-cream/80">Subject</label>
        <Input variant="light" required value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-cream/80">Message</label>
        <Textarea variant="light" required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {defaultEmail && (
        <p className="text-sm text-cream/50">
          Prefer email? Write us at{" "}
          <a href={`mailto:${defaultEmail}`} className="text-gold hover:underline">
            {defaultEmail}
          </a>
        </p>
      )}
      {error && <p className="text-sm text-orange">{error}</p>}
      {status === "success" && (
        <p className="text-sm text-gold">Thanks! We received your message and will reply soon.</p>
      )}
      <Button type="submit" variant="primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
