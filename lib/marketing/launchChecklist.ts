export type LaunchChecklistItem = {
  id: string;
  title: string;
  detail: string;
  category: "ops" | "marketing" | "partners" | "social";
};

/** Client launch roadmap — track in Admin → Marketing */
export const LAUNCH_CHECKLIST: LaunchChecklistItem[] = [
  {
    id: "dry-run",
    title: "Dry run with existing scavenger hunt flow",
    detail: "End-to-end test: book → pay → lobby → play → vault → certificates.",
    category: "ops",
  },
  {
    id: "test-group-video",
    title: "Assign a test group for sample marketing video",
    detail: "Recruit a friendly crew; capture phone footage of clues, Broadway energy, and finish moment.",
    category: "marketing",
  },
  {
    id: "materials",
    title: "Marketing materials & paraphernalia",
    detail: "Posters, stickers, team color cards, finish-line banner, partner offer cards.",
    category: "marketing",
  },
  {
    id: "institutions",
    title: "Tie up with institutions & contacts",
    detail: "Partner outreach using the 50-location master list; written offers before publishing discounts.",
    category: "partners",
  },
  {
    id: "social",
    title: "Social visibility",
    detail: "YouTube, Facebook, Instagram, TikTok, X — link profiles in site settings; post launch clips weekly.",
    category: "social",
  },
  {
    id: "qr",
    title: "QR code to book",
    detail: "Print QR from /book-qr pointing to booking; place on posters and partner counters.",
    category: "marketing",
  },
  {
    id: "brochure",
    title: "Virtual brochure",
    detail: "Share /brochure link in email and social; update when pricing or offers change.",
    category: "marketing",
  },
];
