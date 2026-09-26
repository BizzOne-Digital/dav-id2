export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Certificate } from "@/lib/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type PageProps = { params: Promise<{ slug: string }> };

export const metadata = { title: "Verify certificate" };

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const cert = await Certificate.findOne({ verificationSlug: slug }).lean();
  if (!cert) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <CardHeader>
          <Badge className="mb-2">Verified authentic</Badge>
          <CardTitle>{cert.teamName}</CardTitle>
          <CardDescription>
            Completed the Music City Scavenger Hunt · {cert.rankTitle}
          </CardDescription>
        </CardHeader>
        <dl className="space-y-2 text-sm text-cream/80">
          <div className="flex justify-between">
            <dt>Score</dt>
            <dd className="text-gold">{cert.finalScore ?? 0}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Certificate</dt>
            <dd>{cert.certificateId}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Issued</dt>
            <dd>{cert.createdAt ? new Date(cert.createdAt).toLocaleDateString() : "—"}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
