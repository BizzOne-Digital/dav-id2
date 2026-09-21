import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { COMPETITION_RULES } from "@/lib/site/competitionRules";
import { getGroupSetupGuide } from "@/lib/site/teamSetupGuide";

const GROUP_LINKS = [
  { type: "singles_couples", label: "Solo / couple" },
  { type: "friends", label: "Friends" },
  { type: "family", label: "Family" },
  { type: "corporate", label: "Corporate" },
];

export function TeamsAndGroupsSection({ spacing = "default" }: { spacing?: "default" | "tight" }) {
  const isTight = spacing === "tight";

  return (
    <section
      className={
        isTight
          ? "border-t border-cream/10 bg-charcoal py-8 sm:py-10"
          : "border-t border-cream/10 bg-charcoal section-y"
      }
    >
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Teams & groups"
          title="How you establish teams"
          subtitle="Every competitor needs a ticket. Teams are how you show up on the leaderboard—with a name, a color, and a join code."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-gold/25 bg-gold/5">
            <h3 className="font-[family-name:var(--font-bebas)] text-2xl text-gold">The basics</h3>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-cream/80">
              {COMPETITION_RULES.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link href="/booking" className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
              Start booking →
            </Link>
          </Card>

          <Card>
            <h3 className="font-[family-name:var(--font-bebas)] text-2xl text-gold">Corporate setup</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">{COMPETITION_RULES.corporateNote}</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-cream/75">
              {getGroupSetupGuide("corporate").steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GROUP_LINKS.map(({ type, label }) => {
            const g = getGroupSetupGuide(type);
            return (
              <div key={type} className="rounded-xl border border-cream/10 bg-cream/5 p-4">
                <p className="font-[family-name:var(--font-bebas)] text-lg text-gold">{label}</p>
                <p className="mt-2 text-xs leading-relaxed text-cream/70">{g.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
