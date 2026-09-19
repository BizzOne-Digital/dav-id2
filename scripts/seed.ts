import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import {
  SiteSettings,
  PricingPlan,
  Hunt,
  Location,
  Challenge,
  RouteRecipe,
  FAQ,
  Testimonial,
  Page,
  LeaderboardEntry,
  User,
  Product,
} from "@/lib/models";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnvFiles();

const LOCATIONS: Array<{
  name: string;
  slug: string;
  category: "landmark" | "history" | "retail" | "food" | "scenic" | "music" | "partner";
  description: string;
  address: string;
  lat: number;
  lng: number;
  tags: string[];
}> = [
  {
    name: "Lower Broadway",
    slug: "lower-broadway",
    category: "music",
    description: "Honky-tonk row and live music on every block.",
    address: "Broadway, Nashville, TN 37203",
    lat: 36.1607,
    lng: -86.7781,
    tags: ["music", "nightlife", "downtown"],
  },
  {
    name: "Ryman Auditorium",
    slug: "ryman-auditorium",
    category: "music",
    description: "The Mother Church of Country Music.",
    address: "116 5th Ave N, Nashville, TN 37219",
    lat: 36.1612,
    lng: -86.7784,
    tags: ["history", "music", "landmark"],
  },
  {
    name: "Country Music Hall of Fame",
    slug: "country-music-hall-of-fame",
    category: "music",
    description: "Museum celebrating country music legends.",
    address: "222 Rep John Lewis Way S, Nashville, TN 37203",
    lat: 36.1584,
    lng: -86.7761,
    tags: ["museum", "music"],
  },
  {
    name: "Bridgestone Arena",
    slug: "bridgestone-arena",
    category: "landmark",
    description: "Home of the Nashville Predators and major concerts.",
    address: "501 Broadway, Nashville, TN 37203",
    lat: 36.1592,
    lng: -86.7785,
    tags: ["sports", "events"],
  },
  {
    name: "Johnny Cash Museum",
    slug: "johnny-cash-museum",
    category: "music",
    description: "Artifacts and stories from the Man in Black.",
    address: "119 3rd Ave S, Nashville, TN 37201",
    lat: 36.1609,
    lng: -86.7755,
    tags: ["museum", "music"],
  },
  {
    name: "Printer's Alley",
    slug: "printers-alley",
    category: "history",
    description: "Historic alley of clubs and neon signs.",
    address: "Printer's Alley, Nashville, TN 37219",
    lat: 36.164,
    lng: -86.7792,
    tags: ["history", "nightlife"],
  },
  {
    name: "Tennessee State Capitol",
    slug: "tennessee-state-capitol",
    category: "history",
    description: "Greek Revival capitol overlooking downtown.",
    address: "600 Dr MLK Jr Blvd, Nashville, TN 37243",
    lat: 36.1658,
    lng: -86.7841,
    tags: ["government", "architecture"],
  },
  {
    name: "Bicentennial Capitol Mall",
    slug: "bicentennial-capitol-mall",
    category: "scenic",
    description: "Linear park with Tennessee timeline and views.",
    address: "600 James Robertson Pkwy, Nashville, TN 37243",
    lat: 36.172,
    lng: -86.7875,
    tags: ["park", "history"],
  },
  {
    name: "Schermerhorn Symphony Center",
    slug: "schermerhorn-symphony-center",
    category: "music",
    description: "Home of the Nashville Symphony.",
    address: "One Symphony Pl, Nashville, TN 37201",
    lat: 36.1633,
    lng: -86.7769,
    tags: ["classical", "architecture"],
  },
  {
    name: "Frist Art Museum",
    slug: "frist-art-museum",
    category: "landmark",
    description: "Art deco post office turned world-class museum.",
    address: "919 Broadway, Nashville, TN 37203",
    lat: 36.1576,
    lng: -86.7839,
    tags: ["art", "museum"],
  },
  {
    name: "The Gulch",
    slug: "the-gulch",
    category: "retail",
    description: "Trendy district with murals and boutiques.",
    address: "The Gulch, Nashville, TN 37203",
    lat: 36.1517,
    lng: -86.7845,
    tags: ["murals", "shopping"],
  },
  {
    name: "Musicians Hall of Fame",
    slug: "musicians-hall-of-fame",
    category: "music",
    description: "Session players and unsung heroes of recording.",
    address: "401 Gay St, Nashville, TN 37219",
    lat: 36.1674,
    lng: -86.7788,
    tags: ["museum", "music"],
  },
  {
    name: "Nissan Stadium",
    slug: "nissan-stadium",
    category: "landmark",
    description: "Titans football and skyline views across the river.",
    address: "1 Titans Way, Nashville, TN 37213",
    lat: 36.1665,
    lng: -86.7713,
    tags: ["sports", "river"],
  },
  {
    name: "Pedestrian Bridge",
    slug: "john-seigenthaler-pedestrian-bridge",
    category: "scenic",
    description: "Walk the bridge for postcard downtown views.",
    address: "John Seigenthaler Pedestrian Bridge, Nashville, TN",
    lat: 36.1619,
    lng: -86.7699,
    tags: ["views", "photo"],
  },
  {
    name: "Assembly Food Hall",
    slug: "assembly-food-hall",
    category: "food",
    description: "Multi-vendor food hall at Fifth + Broadway.",
    address: "5055 Broadway Place, Nashville, TN 37203",
    lat: 36.1598,
    lng: -86.778,
    tags: ["food", "family"],
  },
];

const HUNTS = [
  {
    title: "Broadway Beats Hunt",
    slug: "broadway-beats",
    shortDescription: "Live music legends and neon-lit clues downtown.",
    featured: true,
    difficulty: "moderate" as const,
    groupTypes: ["friends", "bachelorette"],
  },
  {
    title: "Music City History Trail",
    slug: "music-city-history",
    shortDescription: "Capitol stories, Printer's Alley secrets, and more.",
    featured: true,
    difficulty: "moderate" as const,
    groupTypes: ["family", "corporate"],
  },
  {
    title: "Family Friendly Downtown",
    slug: "family-friendly-downtown",
    shortDescription: "Kid-safe stops with puzzles everyone can solve.",
    featured: false,
    difficulty: "easy" as const,
    groupTypes: ["family"],
  },
  {
    title: "Date Night Discovery",
    slug: "date-night-discovery",
    shortDescription: "Romantic views and clever riddles for two.",
    featured: false,
    difficulty: "moderate" as const,
    groupTypes: ["couples", "friends"],
  },
  {
    title: "Corporate Team Builder",
    slug: "corporate-team-builder",
    shortDescription: "Competitive scoring built for office outings.",
    featured: false,
    difficulty: "challenging" as const,
    groupTypes: ["corporate"],
  },
  {
    title: "Gulch & Gallery Sprint",
    slug: "gulch-gallery-sprint",
    shortDescription: "Murals, art deco, and photo challenges.",
    featured: false,
    difficulty: "moderate" as const,
    groupTypes: ["friends", "creatives"],
  },
  {
    title: "Riverfront Views Challenge",
    slug: "riverfront-views",
    shortDescription: "Bridge panoramas and stadium skyline puzzles.",
    featured: false,
    difficulty: "easy" as const,
    groupTypes: ["family", "tourists"],
  },
];

async function upsertPricingPlan() {
  return PricingPlan.findOneAndUpdate(
    { slug: "standard-per-person" },
    {
      name: "Standard Hunt",
      slug: "standard-per-person",
      pricePerPersonCents: 5000,
      currency: "usd",
      minimumPlayers: 4,
      durationLabel: "2–3 hours",
      features: [
        "Custom route through downtown Nashville",
        "Mobile-friendly clue platform",
        "Live leaderboard",
        "Completion certificate",
      ],
      isDefault: true,
      active: true,
      priceType: "per_person",
      description: "$50 per person, 4 player minimum.",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function upsertSiteSettings(pricingPlanId: string) {
  return SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
      key: "default",
      businessName: "Nashville Scavenger Hunt",
      tagline: "Explore. Discover. Compete. Create Memories.",
      phone: "615-571-9900",
      email: "howigetemail@gmail.com",
      domain: "NashvilleScavengerHunt.com",
      hero: {
        headline: "Explore. Discover. Compete. Create Memories.",
        subheadline:
          "Turn downtown Nashville into your personal game board. Solve locally inspired clues, complete creative challenges, earn points, climb the leaderboard, and create unforgettable Music City memories.",
        ctaPrimary: "Book Your Hunt",
        ctaSecondary: "Preview a Challenge",
      },
      pricingPlanId,
      defaultPricePerPersonCents: 5000,
      minimumPlayers: 4,
      typicalDurationHours: "2–3",
      newsletterHeading: "Get hunt tips & Nashville insider clues",
      footerText: "© Nashville Scavenger Hunt. All rights reserved.",
      stats: [
        { label: "Teams hosted", value: "500+", isSample: true },
        { label: "Avg. rating", value: "4.9/5", isSample: true },
        { label: "Downtown stops", value: "15+", isSample: true },
      ],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedLocations() {
  const images = [
    "/images/ryman-guitar-case.jpg",
    "/images/broadway-neon.jpg",
    "/images/skyline-river-sunset.jpg",
    "/images/map-pin-downtown.jpg",
    "/images/hot-chicken-hunt.jpg",
    "/images/qr-scan-challenge.jpg",
    "/images/porch-adventure.jpg",
    "/images/flatlay-game-board.jpg",
    "/images/certificate-celebration.jpg",
    "/images/prizes-trophy.jpg",
  ];
  const map = new Map<string, string>();
  for (let i = 0; i < LOCATIONS.length; i++) {
    const loc = LOCATIONS[i];
    const doc = await Location.findOneAndUpdate(
      { slug: loc.slug },
      {
        ...loc,
        image: images[i % images.length],
        zone: "downtown",
        audienceTags: ["all"],
        status: "active",
        outdoor: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    map.set(loc.slug, doc._id.toString());
  }
  return map;
}

async function seedChallenges(locationIds: Map<string, string>) {
  const rymanId = locationIds.get("ryman-auditorium");
  if (rymanId) {
    await Challenge.findOneAndUpdate(
      { title: "Preview: Mother Church Riddle", isPreviewSafe: true },
      {
        locationId: rymanId,
        type: "riddle",
        title: "Preview: Mother Church Riddle",
        instructions:
          "Read the clue and enter the one-word answer. This is a safe preview — no spoilers for paid hunts.",
        clue: "They call this hall the Mother Church of Country Music. What city shares its name with a 1970 Robert Altman film?",
        answer: "nashville",
        acceptedVariants: ["Nashville", "NASHVILLE"],
        hint: "It's the city you're standing in.",
        basePoints: 300,
        difficulty: "easy",
        isPreviewSafe: true,
        isSample: true,
        active: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const challengeSeeds = [
    {
      slug: "lower-broadway",
      type: "observation" as const,
      title: "Honky Tonk Count",
      instructions: "How many live music venues can you spot on this block?",
      answer: "dozens",
      acceptedVariants: ["many", "lots"],
    },
    {
      slug: "country-music-hall-of-fame",
      type: "trivia" as const,
      title: "Hall of Fame Fact",
      instructions: "Which instrument is featured on the museum's rotunda design?",
      answer: "disc",
      acceptedVariants: ["records", "vinyl"],
    },
    {
      slug: "tennessee-state-capitol",
      type: "text" as const,
      title: "Capitol Architect",
      instructions: "Name the architect who designed the Tennessee State Capitol.",
      answer: "strickland",
      acceptedVariants: ["william strickland", "William Strickland"],
    },
  ];

  for (const c of challengeSeeds) {
    const locationId = locationIds.get(c.slug);
    if (!locationId) continue;
    await Challenge.findOneAndUpdate(
      { locationId, title: c.title },
      {
        locationId,
        type: c.type,
        title: c.title,
        instructions: c.instructions,
        answer: c.answer,
        acceptedVariants: c.acceptedVariants,
        active: true,
        basePoints: 250,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

async function seedHunts(pricingPlanId: string) {
  const covers = [
    "/images/broadway-neon.jpg",
    "/images/ryman-guitar-case.jpg",
    "/images/flatlay-game-board.jpg",
    "/images/map-pin-downtown.jpg",
    "/images/skyline-river-sunset.jpg",
    "/images/qr-scan-challenge.jpg",
    "/images/prizes-trophy.jpg",
  ];
  for (let i = 0; i < HUNTS.length; i++) {
    const hunt = HUNTS[i];
    await Hunt.findOneAndUpdate(
      { slug: hunt.slug },
      {
        ...hunt,
        coverImage: covers[i % covers.length],
        gallery: [covers[i % covers.length], covers[(i + 1) % covers.length]],
        fullDescription: hunt.shortDescription,
        priceType: "per_person",
        pricePerPersonCents: 5000,
        minimumPlayers: 4,
        duration: "2–3 hours",
        alcoholFreeAvailable: true,
        includedRewards: ["Leaderboard ranking", "Digital certificate"],
        status: "published",
        pricingPlanId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

async function seedRouteRecipes() {
  await RouteRecipe.findOneAndUpdate(
    { name: "Family Downtown Mix", groupType: "family" },
    {
      name: "Family Downtown Mix",
      groupType: "family",
      categories: [
        { category: "scenic", count: 2 },
        { category: "history", count: 2 },
        { category: "food", count: 1 },
        { category: "landmark", count: 2 },
      ],
      rules: { noAdultInteriors: true, maxWalkingMinutes: 90 },
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await RouteRecipe.findOneAndUpdate(
    { name: "Friends Night Out", groupType: "friends" },
    {
      name: "Friends Night Out",
      groupType: "friends",
      categories: [
        { category: "music", count: 3 },
        { category: "history", count: 2 },
        { category: "retail", count: 1 },
        { category: "food", count: 1 },
      ],
      rules: { noAdultInteriors: false, maxWalkingMinutes: 120 },
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedFaqs() {
  const faqs = [
    {
      question: "How long does a hunt take?",
      answer: "Most teams finish in 2–3 hours at a comfortable walking pace.",
      order: 1,
    },
    {
      question: "Is this kid-friendly?",
      answer: "Yes. Choose a family route and we'll avoid adult-only venues.",
      order: 2,
    },
    {
      question: "What if it rains?",
      answer: "Routes include indoor fallbacks and covered stops where possible.",
      order: 3,
    },
    {
      question: "How many players do we need?",
      answer: "We require a minimum of 4 players; larger groups split into teams.",
      order: 4,
    },
  ];

  for (const faq of faqs) {
    await FAQ.findOneAndUpdate({ question: faq.question }, { ...faq, published: true }, { upsert: true, new: true });
  }
}

async function seedTestimonials() {
  const items = [
    {
      name: "Jamie L.",
      groupType: "bachelorette",
      quote: "Best afternoon in Nashville — we laughed the whole way down Broadway!",
      order: 1,
    },
    {
      name: "The Carter Family",
      groupType: "family",
      quote: "Our teens actually put their phones away to solve clues together.",
      order: 2,
    },
    {
      name: "Metro Marketing Team",
      groupType: "corporate",
      quote: "Perfect team builder. Friendly competition and easy booking.",
      order: 3,
    },
  ];

  for (const t of items) {
    await Testimonial.findOneAndUpdate(
      { quote: t.quote },
      { ...t, rating: 5, isSample: true, published: true },
      { upsert: true, new: true }
    );
  }
}

async function seedLeaderboard() {
  const demos = [
    { teamName: "Honky Tonk Heroes", score: 4820, completedStops: 8, rank: 1 },
    { teamName: "Music City Mavericks", score: 4510, completedStops: 8, rank: 2 },
    { teamName: "Broadway Bandits", score: 4200, completedStops: 7, rank: 3 },
    { teamName: "Nashville Navigators", score: 3980, completedStops: 7, rank: 4 },
    { teamName: "Ryman Runners", score: 3750, completedStops: 6, rank: 5 },
  ];

  for (const entry of demos) {
    await LeaderboardEntry.findOneAndUpdate(
      { teamName: entry.teamName, isDemo: true },
      { ...entry, isDemo: true, scope: "public" },
      { upsert: true, new: true }
    );
  }
}

async function seedPages() {
  await Page.findOneAndUpdate(
    { slug: "about" },
    {
      slug: "about",
      title: "About Us",
      seoTitle: "About Nashville Scavenger Hunt",
      heroTitle: "We turn Music City into your game board",
      heroSubtitle: "Locally written clues, fair routes, and unforgettable team moments.",
      content:
        "<p>Nashville Scavenger Hunt designs downtown adventures for families, friends, and corporate teams.</p>",
    },
    { upsert: true, new: true }
  );

  await Page.findOneAndUpdate(
    { slug: "policies" },
    {
      slug: "policies",
      title: "Policies",
      seoTitle: "Booking & Privacy Policies",
      heroTitle: "Policies",
      heroSubtitle: "Cancellation, weather, privacy, and photo consent.",
      content:
        "<p>Full policy text is managed here. Contact us with any questions before your hunt.</p>",
    },
    { upsert: true, new: true }
  );
}

async function seedProducts() {
  await Product.findOneAndUpdate(
    { slug: "gift-card-100" },
    {
      title: "Nashville Hunt Gift Card — $100",
      slug: "gift-card-100",
      description: "Redeem toward any public scavenger hunt booking.",
      productType: "gift_card",
      priceCents: 10000,
      currency: "usd",
      active: true,
      metadata: { denomination: 100 },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("Skipping admin user: set ADMIN_EMAIL and ADMIN_PASSWORD to seed admin.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      name: "Site Admin",
      email: email.toLowerCase(),
      passwordHash,
      role: "admin",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required to run seed");
  }

  await connectDB();

  const pricing = await upsertPricingPlan();
  await upsertSiteSettings(pricing._id.toString());
  const locationIds = await seedLocations();
  await seedChallenges(locationIds);
  await seedHunts(pricing._id.toString());
  await seedRouteRecipes();
  await seedFaqs();
  await seedTestimonials();
  await seedLeaderboard();
  await seedPages();
  await seedProducts();
  await seedAdminUser();

  console.log("Seed completed successfully.");
  console.log(`  Pricing plan: ${pricing.slug} ($${pricing.pricePerPersonCents / 100}/person, min ${pricing.minimumPlayers})`);
  console.log(`  Locations: ${LOCATIONS.length}`);
  console.log(`  Hunts: ${HUNTS.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    const code = err && typeof err === "object" && "code" in err ? String(err.code) : "";
    if (code === "ENOTFOUND") {
      console.error(
        "Seed failed: MongoDB host not found (DNS). Open MongoDB Atlas → your cluster → Connect → Drivers, copy the connection string, and set MONGODB_URI in .env.local (cluster may have been renamed or deleted)."
      );
    } else {
      console.error("Seed failed:", err);
    }
    process.exit(1);
  });
