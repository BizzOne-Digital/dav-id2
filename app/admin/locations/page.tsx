"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useAdminToast } from "@/components/admin/AdminToastProvider";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

type LocationRow = { _id: string; name: string; category: string; status?: string; image?: string };

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [editing, setEditing] = useState<LocationRow | null>(null);
  const [image, setImage] = useState("");
  const { toastSuccess, toastError } = useAdminToast();

  function load() {
    fetch("/api/admin/locations")
      .then((r) => r.json())
      .then((d) => setLocations(d.locations ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function saveImage(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/locations/${editing._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    if (res.ok) {
      toastSuccess("Location image updated");
      setEditing(null);
      load();
    } else toastError("Update failed");
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Locations</h1>
      <p className="text-cream/70">{locations.length} locations in catalog.</p>

      {editing && (
        <Card className="mt-6 max-w-lg">
          <CardHeader>
            <CardTitle className="text-base">Photo — {editing.name}</CardTitle>
          </CardHeader>
          <form onSubmit={saveImage} className="space-y-4">
            <LocalImageField folder="gallery" value={image} onChange={setImage} />
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <ul className="mt-6 space-y-2">
        {locations.map((loc) => (
          <li key={loc._id}>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                {loc.image && (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={resolvePublicImageUrl(loc.image)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={loc.image.startsWith("/api/uploads/")}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-base">{loc.name}</CardTitle>
                  <p className="text-xs text-cream/50">{loc.category} · {loc.status}</p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="!px-3 !py-1.5 text-xs"
                  onClick={() => {
                    setEditing(loc);
                    setImage(loc.image ?? "");
                  }}
                >
                  Image
                </Button>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
