import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/connect";
import { Certificate, GameSession, Team } from "@/lib/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Certificates" };

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/certificates");

  await connectDB();
  const teams = await Team.find({ captainId: session.user.id }).lean();
  const teamIds = teams.map((t) => t._id.toString());
  const sessions = await GameSession.find({ teamId: { $in: teamIds } }).lean();
  const sessionIds = sessions.map((s) => s._id.toString());

  const certificates = await Certificate.find({ sessionId: { $in: sessionIds } })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-gold hover:underline">← Dashboard</Link>
      <h1 className="mt-4 font-[family-name:var(--font-bebas)] text-4xl text-gold">Certificates</h1>
      {certificates.length === 0 ? (
        <Card className="mt-6">
          <CardDescription>Complete a hunt to unlock your Music City certificate.</CardDescription>
        </Card>
      ) : (
        <ul className="mt-6 space-y-4">
          {certificates.map((cert) => (
            <li key={cert._id.toString()}>
              <Card>
                <CardHeader>
                  <CardTitle>{cert.teamName ?? "Your team"}</CardTitle>
                  <CardDescription>
                    {cert.rankTitle} · Score {cert.finalScore ?? 0}
                  </CardDescription>
                </CardHeader>
                <Link href={`/certificate/${cert.certificateId}`} className="text-sm text-gold hover:underline">
                  View certificate →
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
