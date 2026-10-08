import { slugify } from "@/lib/utils";

export type ChallengeContentOverride = {
  title: string;
  clue: string;
  instructions: string;
  answer: string;
  acceptedVariants?: string[];
  hint: string;
  type?: "trivia" | "observation" | "photo" | "riddle";
  verificationMethod?: "answer" | "hybrid" | "photo";
};

/** Production-quality copy for seeded "Sample:" challenges (keyed by location slug). */
const OVERRIDES: Record<string, ChallengeContentOverride> = {
  "music-city-walk-of-fame-park": {
    title: "Walk of Fame Star Search",
    clue:
      "You're at Music City Walk of Fame Park on 4th Avenue South. Bronze medallions honor Nashville legends embedded in the sidewalk and paths.",
    instructions:
      "Find the star honoring Dolly Parton. Read the name on the medallion, then strike your best \"album cover\" pose beside it and snap a photo for your team.",
    answer: "dolly",
    acceptedVariants: ["dolly parton", "parton", "dolly parton"],
    hint: "Look for the blonde country queen who wrote \"Jolene\" and \"9 to 5.\"",
    type: "photo",
    verificationMethod: "hybrid",
  },
  "legends-corner": {
    title: "Legends Corner Facade",
    clue: "Legends Corner sits at 428 Broadway — a classic honky-tonk with big album art on the outside walls.",
    instructions:
      "Find any album cover painted on the exterior. In your answer, name the artist OR album title you see (either is fine).",
    answer: "legends",
    acceptedVariants: ["legend", "album", "cover", "music"],
    hint: "Walk the sidewalk along Broadway and scan the building murals — country icons everywhere.",
    type: "observation",
  },
  "ryman-auditorium": {
    title: "Mother Church Trivia",
    clue: "The Ryman Auditorium is nicknamed the Mother Church of Country Music.",
    instructions: "What city is this venue in? (One famous two-word nickname.)",
    answer: "music city",
    acceptedVariants: ["Music City", "nashville", "Nashville"],
    hint: "It's the same nickname on every visitor guide in town.",
    type: "trivia",
  },
  "national-museum-of-african-american-music": {
    title: "NMAAM Rhythm",
    clue: "NMAAM rises at Fifth and Broadway — Nashville's museum dedicated to African American music traditions.",
    instructions:
      "Look at the building exterior. How many large letter N's can you spot on the main facade? Enter that number.",
    answer: "3",
    acceptedVariants: ["three", "3"],
    hint: "Count the big letters on the street-facing signage.",
    type: "observation",
  },
  "bicentennial-capitol-mall-state-park": {
    title: "Tennessee Map",
    clue: "Bicentennial Mall stretches north toward the Capitol with a giant granite map of Tennessee underfoot.",
    instructions:
      "Find the Nashville / Davidson County marker on the state map. What is Davidson's county number? (Two digits on the stone.)",
    answer: "19",
    acceptedVariants: ["nineteen"],
    hint: "Walk the map toward the Capitol end — counties are labeled with numbers.",
    type: "observation",
  },
  "the-stage-on-broadway": {
    title: "Guitar Spotter",
    clue: "The Stage on Broadway is known for live music and bold signage on 412 Broadway.",
    instructions:
      "Spot something guitar-shaped on or near the building exterior. Type GUITAR when you've found it and taken a team photo.",
    answer: "guitar",
    acceptedVariants: ["GUITAR", "done", "complete"],
    hint: "Look up at signs and neon — think six strings.",
    type: "photo",
    verificationMethod: "hybrid",
  },
};

export function getChallengeOverride(locationName: string): ChallengeContentOverride | null {
  const slug = slugify(locationName);
  return OVERRIDES[slug] ?? null;
}

export function applyChallengeOverride<T extends {
  title?: string | null;
  clue?: string | null;
  instructions: string;
  answer?: string | null;
  acceptedVariants?: string[] | null;
  hint?: string | null;
  type?: string;
  verificationMethod?: string;
  isSample?: boolean;
}>(locationName: string, challenge: T): T {
  const override = getChallengeOverride(locationName);
  if (!override) return challenge;
  return {
    ...challenge,
    title: override.title,
    clue: override.clue,
    instructions: override.instructions,
    answer: override.answer,
    acceptedVariants: override.acceptedVariants ?? challenge.acceptedVariants,
    hint: override.hint,
    type: override.type ?? challenge.type,
    verificationMethod: override.verificationMethod ?? challenge.verificationMethod,
  };
}

export function displayChallengeTitle(title?: string | null, locationName?: string) {
  const raw = title ?? locationName ?? "Challenge";
  return raw.replace(/^sample:\s*/i, "").trim();
}
