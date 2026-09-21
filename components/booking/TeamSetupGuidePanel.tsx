import { Users, Building2, Heart, PartyPopper, MapPin, UserRound } from "lucide-react";
import type { GroupSetupGuide } from "@/lib/site/teamSetupGuide";

const ICONS: Record<string, typeof Users> = {
  singles_couples: UserRound,
  friends: Users,
  family: Heart,
  bachelorette: PartyPopper,
  corporate: Building2,
  tourists: MapPin,
};

type TeamSetupGuidePanelProps = {
  groupType: string;
  guide: GroupSetupGuide;
};

export function TeamSetupGuidePanel({ groupType, guide }: TeamSetupGuidePanelProps) {
  const Icon = ICONS[groupType] ?? Users;

  return (
    <div className="rounded-xl border border-denim/40 bg-denim/10 p-4 sm:p-5">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-denim/30 text-gold">
          <Icon className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">{guide.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-cream/85">{guide.summary}</p>
        </div>
      </div>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-cream/75">
        {guide.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-cream/55">
        <span className="font-medium text-cream/70">Naming ideas: </span>
        {guide.teamNamingTip}
      </p>
    </div>
  );
}
