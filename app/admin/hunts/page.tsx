"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useAdminToast } from "@/components/admin/AdminToastProvider";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

type HuntRow = {
  _id: string;
  title: string;
  slug: string;
  status?: string;
  coverImage?: string;
};

export default function AdminHuntsPage() {
  const [hunts, setHunts] = useState<HuntRow[]>([]);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState<HuntRow | null>(null);
  const [coverImage, setCoverImage] = useState("");
  const { toastSuccess, toastError } = useAdminToast();

  function load() {
    fetch("/api/admin/hunts").then((r) => r.json()).then((d) => setHunts(d.hunts ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function createHunt(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/hunts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    load();
  }

  async function saveCover(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/hunts/${editing._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverImage }),
    });
    if (res.ok) {
      toastSuccess("Hunt image updated");
      setEditing(null);
      load();
    } else toastError("Update failed");
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Hunts</h1>
      <form onSubmit={createHunt} className="mt-6 flex max-w-md gap-2">
        <Input label="New hunt title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button type="submit" className="self-end">Add</Button>
      </form>

      {editing && (
        <Card className="mt-8 max-w-lg">
          <CardHeader>
            <CardTitle>Edit cover — {editing.title}</CardTitle>
          </CardHeader>
          <form onSubmit={saveCover} className="space-y-4">
            <LocalImageField folder="gallery" value={coverImage} onChange={setCoverImage} />
            <div className="flex gap-2">
              <Button type="submit">Save cover</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <ul className="mt-8 space-y-3">
        {hunts.map((h) => (
          <li key={h._id}>
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-4 sm:flex-row">
                {h.coverImage && (
                  <div className="relative h-32 w-full shrink-0 sm:w-48">
                    <Image
                      src={resolvePublicImageUrl(h.coverImage)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="192px"
                      unoptimized={h.coverImage.startsWith("/api/uploads/")}
                    />
                  </div>
                )}
                <CardHeader className="flex flex-1 flex-row items-center justify-between">
                  <div>
                    <CardTitle>{h.title}</CardTitle>
                    <CardDescription>{h.slug}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{h.status ?? "draft"}</Badge>
                    <Button
                      type="button"
                      variant="secondary"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => {
                        setEditing(h);
                        setCoverImage(h.coverImage ?? "");
                      }}
                    >
                      Cover image
                    </Button>
                  </div>
                </CardHeader>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
