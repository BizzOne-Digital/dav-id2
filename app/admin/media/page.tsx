"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useAdminToast } from "@/components/admin/AdminToastProvider";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";
import type { UploadFolder } from "@/lib/uploads/constants";

type Asset = { _id: string; url: string; alt?: string; category?: string };

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [pendingUrl, setPendingUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [folder, setFolder] = useState<UploadFolder>("gallery");
  const { toastSuccess, toastError } = useAdminToast();

  function load() {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((d) => setAssets(d.assets ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function registerAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingUrl) {
      toastError("Upload an image first");
      return;
    }
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: pendingUrl, alt, category: folder }),
    });
    if (res.ok) {
      toastSuccess("Added to media library");
      setPendingUrl("");
      setAlt("");
      load();
    } else toastError("Could not save asset record");
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Media library</h1>
      <p className="mt-2 text-sm text-cream/60">
        Files are stored in MongoDB and served from <code className="text-gold">/api/uploads/…</code> (safe for Vercel).
      </p>

      <Card className="mt-8 max-w-lg">
        <CardHeader>
          <CardTitle>Upload new image</CardTitle>
        </CardHeader>
        <form onSubmit={registerAsset} className="space-y-4">
          <label className="block text-sm text-cream/80">
            Folder
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as UploadFolder)}
              className="mt-1 w-full rounded-lg border border-cream/20 bg-charcoal px-3 py-2 text-cream"
            >
              <option value="gallery">gallery</option>
              <option value="pages">pages</option>
              <option value="products">products</option>
              <option value="misc">misc</option>
            </select>
          </label>
          <LocalImageField folder={folder} value={pendingUrl} onChange={setPendingUrl} />
          <Input label="Alt text" value={alt} onChange={(e) => setAlt(e.target.value)} />
          <Button type="submit">Save to library</Button>
        </form>
      </Card>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <Card key={a._id} className="overflow-hidden p-0">
            <div className="relative aspect-video bg-charcoal">
              <Image
                src={resolvePublicImageUrl(a.url)}
                alt={a.alt ?? ""}
                fill
                className="object-cover"
                sizes="320px"
                unoptimized={a.url.startsWith("/api/uploads/")}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-sm">{a.alt ?? a.category ?? "Asset"}</CardTitle>
              <p className="truncate text-xs text-cream/40">{a.url}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
