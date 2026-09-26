export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Certificate } from "@/lib/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type PageProps = { params: Promise<{ id: string }> };

export default async function CertificatePage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const cert = await Certificate.findOne({ certificateId: id }).lean();
  if (!cert) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <p className="font-[family-name:var(--font-caveat)] text-2xl text-gold">Music City Certificate</p>
      <Card className="mt-8 border-gold/30">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-bebas)] text-4xl text-gold">
            {cert.teamName}
          </CardTitle>
          <CardDescription className="text-lg">{cert.rankTitle}</CardDescription>
        </CardHeader>
        <p className="text-3xl font-bold text-cream">{cert.finalScore ?? 0} points</p>
        <p className="mt-4 text-sm text-cream/50">ID {cert.certificateId}</p>
        {cert.verificationSlug && (
          <Button
            href={`/certificate/verify/${cert.verificationSlug}`}
            variant="secondary"
            className="mt-6"
          >
            Verification page
          </Button>
        )}
      </Card>
      <Link href="/dashboard/certificates" className="mt-8 inline-block text-sm text-gold hover:underline">
        ← All certificates
      </Link>
    </div>
  );
}
