import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { DEFAULT_IN_GAME_OFFERS } from "@/lib/site/inGameOffers";
import { standardPricingDescription } from "@/lib/site/groupSizeCopy";
import { CATALOG_HUNTS, CATALOG_HUNT_COVER_PATHS, coverImageForHunt } from "@/lib/site/huntCatalog";
import { slugify } from "@/lib/utils";
import {
  loadGeocodeCache,
  loadMasterLocationRows,
  resolveCoordsForMasterRow,
} from "@/lib/locations/loadMasterLocations";
import { masterRowToLocationDoc } from "@/lib/locations/masterLocationTypes";
import { computeMasterKpis } from "@/lib/locations/routeRandomizer";
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

async function upsertPricingPlan() {
  return PricingPlan.findOneAndUpdate(
    { slug: "standard-per-person" },
    {
      name: "Standard Hunt",
      slug: "standard-per-person",
      pricePerPersonCents: 2995,
      volumePricePerPersonCents: 2500,
      volumeMinPlayers: 10,
      currency: "usd",
      minimumPlayers: 1,
      durationLabel: "2–3 hours",
      features: [
        "Custom route through downtown Nashville",
        "Mobile-friendly clue platform",
        "Live leaderboard",
        "Completion certificate",
        "10+ players: $25/person (corporate included)",
      ],
      isDefault: true,
      active: true,
      priceType: "per_person",
      description: standardPricingDescription(1),
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
        ctaPrimary: "Book Your Adventure",
        ctaSecondary: "Preview a Challenge",
      },
      pricingPlanId,
      defaultPricePerPersonCents: 2995,
      volumePricePerPersonCents: 2500,
      volumeMinPlayers: 10,
      minimumPlayers: 1,
      typicalDurationHours: "2–3",
      newsletterHeading: "Get hunt tips & Nashville insider clues",
      footerText: "© Nashville Scavenger Hunt. All rights reserved.",
      stats: [
        { label: "Teams hosted", value: "500+", isSample: true },
        { label: "Avg. rating", value: "4.9/5", isSample: true },
        { label: "Downtown stops", value: "50", isSample: false },
      ],
      inGameOffers: DEFAULT_IN_GAME_OFFERS,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedLocations() {
  const masterRows = loadMasterLocationRows();
  const geocache = loadGeocodeCache();
  const kpis = computeMasterKpis(masterRows);
  console.log(`  Master KPIs: ${kpis.totalRecords} records, ${kpis.gameStops} game stops, ${kpis.highPriorityProspects} high priority`);

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
  const masterSlugs = new Set<string>();

  for (let i = 0; i < masterRows.length; i++) {
    const row = masterRows[i];
    const slug = slugify(row.name);
    masterSlugs.add(slug);
    const coords = resolveCoordsForMasterRow(row, geocache);
    const docFields = masterRowToLocationDoc(row, slug, coords);
    const doc = await Location.findOneAndUpdate(
      { slug },
      {
        ...docFields,
        image: images[i % images.length],
        version: 2,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    map.set(slug, doc._id.toString());
  }

  await Location.updateMany(
    { slug: { $nin: [...masterSlugs] }, masterId: { $exists: false } },
    { status: "suppressed" }
  );

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
        verificationMethod: "hybrid",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const masterRows = loadMasterLocationRows();
  for (const row of masterRows) {
    if (!row.gameStopEligible || !row.sampleChallenge) continue;
    const slug = slugify(row.name);
    const locationId = locationIds.get(slug);
    if (!locationId) continue;
    const title = `Sample: ${row.name}`;
    const needsPhoto = /photo|selfie|video|pose|panorama/i.test(row.sampleChallenge);
    await Challenge.findOneAndUpdate(
      { locationId, title },
      {
        locationId,
        type: needsPhoto ? "photo" : "observation",
        title,
        instructions: `${row.sampleChallenge} Complete from the exterior unless your route says otherwise. No purchase or alcohol required.`,
        clue: row.sampleChallenge,
        basePoints: row.priority === "high" ? 300 : 250,
        difficulty: "moderate",
        isSample: true,
        active: true,
        verificationMethod: needsPhoto ? "hybrid" : "answer",
        audienceTags: parseAudienceTagsFromFit(row.audienceFit),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

function parseAudienceTagsFromFit(audienceFit: string): string[] {
  const tags: string[] = [];
  const lower = audienceFit.toLowerCase();
  if (lower.includes("individuals: yes") || lower.includes("individuals: daytime") || lower.includes("individuals: exterior")) {
    tags.push("individual");
  }
  if (lower.includes("friends/adult: yes")) tags.push("friends");
  if (lower.includes("families: yes") || lower.includes("families: daytime") || lower.includes("families: exterior")) {
    tags.push("family");
  }
  if (lower.includes("corporate: yes")) tags.push("corporate");
  return tags;
}

async function seedHunts(pricingPlanId: string) {
  for (let i = 0; i < CATALOG_HUNTS.length; i++) {
    const hunt = CATALOG_HUNTS[i];
    const cover = coverImageForHunt(hunt, i);
    await Hunt.findOneAndUpdate(
      { slug: hunt.slug },
      {
        ...hunt,
        coverImage: cover,
        gallery: [cover, CATALOG_HUNT_COVER_PATHS[(i + 1) % CATALOG_HUNT_COVER_PATHS.length]],
        fullDescription: hunt.shortDescription,
        priceType: "per_person",
        pricePerPersonCents: 2995,
        minimumPlayers: 1,
        duration: "2–3 hours",
        alcoholFreeAvailable: true,
        includedRewards: ["Leaderboard ranking", "Digital certificate"],
        status: "published",
        pricingPlanId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const catalogSlugs = CATALOG_HUNTS.map((h) => h.slug);
  await Hunt.updateMany(
    { slug: { $nin: catalogSlugs }, status: "published" },
    { status: "archived" }
  );
}

async function seedRouteRecipes() {
  const zoneNote =
    "Zones A Broadway, B SoBro, C Civic/North, D Riverfront. No purchase or alcohol required to complete challenges.";

  await RouteRecipe.findOneAndUpdate(
    { name: "Family Downtown Mix", groupType: "family" },
    {
      name: "Family Downtown Mix",
      groupType: "family",
      categories: [
        { category: "scenic", count: 2 },
        { category: "history", count: 2 },
        { category: "food", count: 1 },
        { category: "retail", count: 1 },
        { category: "landmark", count: 2 },
      ],
      rules: { noAdultInteriors: true, maxWalkingMinutes: 120 },
      active: true,
      version: 2,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await RouteRecipe.findOneAndUpdate(
    { name: "Friends Night Out", groupType: "friends" },
    {
      name: "Friends Night Out",
      groupType: "friends",
      categories: [
        { category: "music", count: 4 },
        { category: "food", count: 2 },
        { category: "retail", count: 2 },
        { category: "scenic", count: 2 },
      ],
      rules: { noAdultInteriors: false, maxWalkingMinutes: 150 },
      active: true,
      version: 2,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await RouteRecipe.findOneAndUpdate(
    { name: "Singles & Couples Discovery", groupType: "singles_couples" },
    {
      name: "Singles & Couples Discovery",
      groupType: "singles_couples",
      categories: [
        { category: "landmark", count: 2 },
        { category: "scenic", count: 2 },
        { category: "retail", count: 2 },
        { category: "history", count: 2 },
      ],
      rules: { noAdultInteriors: true, maxWalkingMinutes: 120 },
      active: true,
      version: 2,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await RouteRecipe.findOneAndUpdate(
    { name: "Corporate Team Builder", groupType: "corporate" },
    {
      name: "Corporate Team Builder",
      groupType: "corporate",
      categories: [
        { category: "landmark", count: 3 },
        { category: "history", count: 2 },
        { category: "food", count: 2 },
        { category: "scenic", count: 2 },
        { category: "retail", count: 2 },
      ],
      rules: { noAdultInteriors: false, maxWalkingMinutes: 180 },
      active: true,
      version: 2,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`  Route recipes: ${zoneNote}`);
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
      answer: "Book as a single or couple on one ticket (1–2 players), or bring a larger crew—groups of 10+ split into teams and get our volume rate.",
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
  console.log(`  Locations: ${loadMasterLocationRows().length} (master catalog)`);
  console.log(`  Hunts: ${CATALOG_HUNTS.length}`);
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
