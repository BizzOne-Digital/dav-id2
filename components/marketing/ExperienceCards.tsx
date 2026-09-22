import Link from "next/link";
import Image from "next/image";
import { Briefcase, Cake, Heart, GraduationCap, Sparkles, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

const EXPERIENCES = [
  {
    icon: Users,
    title: "Friends & Family",
    description: "Birthdays, reunions, and weekend visitors who want a lively tour with a competitive twist.",
    href: "/booking?type=friends",
    image: MARKETING_IMAGES.broadway,
  },
  {
    icon: Briefcase,
    title: "Corporate Teams",
    description: "Break the ice, build rapport, and explore downtown between meetings or off-sites.",
    href: "/booking?type=corporate",
    image: MARKETING_IMAGES.flatlay,
  },
  {
    icon: Sparkles,
    title: "Bachelorette Parties",
    description:
      "Broadway-ready clues, photo stops, and lighthearted competition for the bride tribe—no spreadsheets, just Nashville.",
    href: "/booking?hunt=bachelorette-downtown",
    image: MARKETING_IMAGES.bachelorette,
  },
  {
    icon: Cake,
    title: "Celebrations",
    description: "Bachelor parties, milestones, and any excuse to make Nashville your playground.",
    href: "/booking?type=celebration",
    image: MARKETING_IMAGES.prizes,
  },
  {
    icon: GraduationCap,
    title: "School & Youth",
    description: "Educational stops with teacher-friendly pacing and optional chaperone tools.",
    href: "/booking?type=school",
    image: MARKETING_IMAGES.ryman,
  },
  {
    icon: Heart,
    title: "Date Night",
    description: "A playful two-person adventure—team up or friendly rivalry along the route.",
    href: "/booking?type=date",
    image: MARKETING_IMAGES.porch,
  },
];

export function ExperienceCards() {
  return (
    <section className="bg-[#0c0e11] section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Experiences"
          title="Built for your kind of crew"
          subtitle="Every hunt uses the same Nashville soul—tuned for how your group likes to play."
        />

        <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {EXPERIENCES.map((exp) => {
            const Icon = exp.icon;
            return (
              <Link key={exp.title} href={exp.href} className="group block h-full overflow-hidden rounded-xl">
                <Card className="h-full overflow-hidden p-0 transition-colors group-hover:border-gold/40">
                  <div className="relative h-44 w-full">
                    <Image
                      src={exp.image.src}
                      alt={exp.image.alt}
                      fill
                      className="object-cover brightness-[1.1] contrast-[1.03] saturate-[1.05] transition-transform duration-500 group-hover:scale-105"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                    <Icon className="absolute left-4 top-4 size-9 text-gold drop-shadow" aria-hidden />
                  </div>
                  <div className="p-6">
                    <CardTitle>{exp.title}</CardTitle>
                    <CardDescription className="mt-2">{exp.description}</CardDescription>
                    <span className="mt-4 inline-block text-sm font-semibold text-gold group-hover:underline">
                      Start booking →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/booking" variant="primary" magnetic>
            View all booking options
          </Button>
        </div>
      </div>
    </section>
  );
}
