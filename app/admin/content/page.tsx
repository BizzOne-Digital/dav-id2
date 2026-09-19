"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastProvider";

type Faq = {
  _id: string;
  question: string;
  answer: string;
  order?: number;
  published?: boolean;
};

type Testimonial = {
  _id: string;
  quote: string;
  name?: string;
  groupType?: string;
  rating?: number;
  order?: number;
  published?: boolean;
};

async function postContent(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export default function AdminContentPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    groupType: "",
    quote: "",
    rating: 5,
  });
  const { toastSuccess, toastError } = useAdminToast();

  const load = useCallback(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => {
        setFaqs(d.faqs ?? []);
        setTestimonials(d.testimonials ?? []);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveFaq(faq: Faq) {
    try {
      await postContent({
        type: "faq",
        action: "update",
        id: faq._id,
        data: {
          question: faq.question,
          answer: faq.answer,
          order: faq.order ?? 0,
          published: faq.published !== false,
        },
      });
      toastSuccess("FAQ updated");
      setEditingFaq(null);
      load();
    } catch {
      toastError("FAQ save failed");
    }
  }

  async function createFaq() {
    try {
      await postContent({
        type: "faq",
        action: "create",
        data: {
          question: newFaq.question,
          answer: newFaq.answer,
          order: faqs.length,
          published: true,
        },
      });
      toastSuccess("FAQ created");
      setNewFaq({ question: "", answer: "" });
      load();
    } catch {
      toastError("FAQ create failed");
    }
  }

  async function deleteFaq(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await postContent({ type: "faq", action: "delete", id });
      toastSuccess("FAQ deleted");
      load();
    } catch {
      toastError("Delete failed");
    }
  }

  async function saveTestimonial(t: Testimonial) {
    try {
      await postContent({
        type: "testimonial",
        action: "update",
        id: t._id,
        data: {
          name: t.name,
          groupType: t.groupType,
          quote: t.quote,
          rating: t.rating ?? 5,
          order: t.order ?? 0,
          published: t.published !== false,
        },
      });
      toastSuccess("Testimonial updated");
      setEditingTestimonial(null);
      load();
    } catch {
      toastError("Testimonial save failed");
    }
  }

  async function createTestimonial() {
    try {
      await postContent({
        type: "testimonial",
        action: "create",
        data: {
          name: newTestimonial.name,
          groupType: newTestimonial.groupType,
          quote: newTestimonial.quote,
          rating: newTestimonial.rating,
          order: testimonials.length,
          published: true,
        },
      });
      toastSuccess("Testimonial created");
      setNewTestimonial({ name: "", groupType: "", quote: "", rating: 5 });
      load();
    } catch {
      toastError("Create failed");
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await postContent({ type: "testimonial", action: "delete", id });
      toastSuccess("Deleted");
      load();
    } catch {
      toastError("Delete failed");
    }
  }

  return (
    <div className="grid gap-10 xl:grid-cols-2">
      <section className="space-y-6">
        <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">FAQs</h1>
        <p className="text-sm text-cream/60">Shown on the home FAQ section and /faq page when published.</p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add FAQ</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <Input
              label="Question"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            />
            <label className="block text-sm font-medium text-cream/80">
              Answer
              <textarea
                className="mt-1 w-full rounded-lg border border-cream/20 bg-charcoal/80 px-3 py-2 text-sm"
                rows={3}
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              />
            </label>
            <Button type="button" onClick={createFaq} disabled={!newFaq.question || !newFaq.answer}>
              Add FAQ
            </Button>
          </div>
        </Card>

        <ul className="space-y-4">
          {faqs.map((f) =>
            editingFaq?._id === f._id ? (
              <li key={f._id}>
                <Card className="space-y-3 p-4">
                  <Input
                    label="Question"
                    value={editingFaq.question}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  />
                  <textarea
                    className="w-full rounded-lg border border-cream/20 bg-charcoal/80 px-3 py-2 text-sm"
                    rows={3}
                    value={editingFaq.answer}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingFaq.published !== false}
                      onChange={(e) => setEditingFaq({ ...editingFaq, published: e.target.checked })}
                    />
                    Published on site
                  </label>
                  <div className="flex gap-2">
                    <Button type="button" onClick={() => saveFaq(editingFaq)}>
                      Save
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setEditingFaq(null)}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              </li>
            ) : (
              <li key={f._id}>
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-sm">{f.question}</CardTitle>
                      <p className="mt-2 text-xs text-cream/70 line-clamp-2">{f.answer}</p>
                      {f.published === false && (
                        <span className="mt-1 inline-block text-xs text-orange-400">Draft</span>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button type="button" variant="secondary" onClick={() => setEditingFaq(f)}>
                        Edit
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => deleteFaq(f._id)}>
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            )
          )}
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="font-[family-name:var(--font-bebas)] text-3xl text-gold">Testimonials</h2>
        <p className="text-sm text-cream/60">Homepage carousel uses published testimonials from the database.</p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add testimonial</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <Input
              label="Name"
              value={newTestimonial.name}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
            />
            <Input
              label="Group type"
              value={newTestimonial.groupType}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, groupType: e.target.value })}
            />
            <textarea
              className="w-full rounded-lg border border-cream/20 bg-charcoal/80 px-3 py-2 text-sm"
              rows={3}
              placeholder="Quote"
              value={newTestimonial.quote}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
            />
            <Button type="button" onClick={createTestimonial} disabled={!newTestimonial.quote}>
              Add testimonial
            </Button>
          </div>
        </Card>

        <ul className="space-y-4">
          {testimonials.map((t) =>
            editingTestimonial?._id === t._id ? (
              <li key={t._id}>
                <Card className="space-y-3 p-4">
                  <Input
                    label="Name"
                    value={editingTestimonial.name ?? ""}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  />
                  <Input
                    label="Group type"
                    value={editingTestimonial.groupType ?? ""}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, groupType: e.target.value })
                    }
                  />
                  <textarea
                    className="w-full rounded-lg border border-cream/20 bg-charcoal/80 px-3 py-2 text-sm"
                    rows={3}
                    value={editingTestimonial.quote}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editingTestimonial.published !== false}
                      onChange={(e) =>
                        setEditingTestimonial({ ...editingTestimonial, published: e.target.checked })
                      }
                    />
                    Published on site
                  </label>
                  <div className="flex gap-2">
                    <Button type="button" onClick={() => saveTestimonial(editingTestimonial)}>
                      Save
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setEditingTestimonial(null)}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              </li>
            ) : (
              <li key={t._id}>
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-sm">{t.name}</CardTitle>
                      <p className="text-xs text-cream/50">{t.groupType}</p>
                      <p className="mt-2 text-xs text-cream/70 line-clamp-3">{t.quote}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button type="button" variant="secondary" onClick={() => setEditingTestimonial(t)}>
                        Edit
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => deleteTestimonial(t._id)}>
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
}
