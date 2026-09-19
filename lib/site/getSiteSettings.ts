import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/lib/models/SiteSettings";
import { PricingPlan } from "@/lib/models/PricingPlan";
import { FAQ } from "@/lib/models/Content";
import { Testimonial } from "@/lib/models/Content";
import { LeaderboardEntry } from "@/lib/models/Leaderboard";

export async function getSiteSettings() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne({ key: "default" }).lean();
    if (!settings) {
      const created = await SiteSettings.create({ key: "default" });
      settings = created.toObject();
    }
    let pricing = null;
    if (settings.pricingPlanId) {
      pricing = await PricingPlan.findById(settings.pricingPlanId).lean();
    }
    if (!pricing) {
      pricing = await PricingPlan.findOne({ isDefault: true, active: true }).lean();
    }
    return { settings, pricing };
  } catch {
    return {
      settings: {
        businessName: "Nashville Scavenger Hunt",
        tagline: "Explore. Discover. Compete. Create Memories.",
        phone: "615-571-9900",
        email: "howigetemail@gmail.com",
        defaultPricePerPersonCents: 2995,
        volumePricePerPersonCents: 2500,
        volumeMinPlayers: 10,
        minimumPlayers: 4,
        typicalDurationHours: "2–3",
        hero: {
          headline: "Explore. Discover. Compete. Create Memories.",
          subheadline:
            "Turn downtown Nashville into your personal game board. Solve locally inspired clues, complete creative challenges, earn points, climb the leaderboard, and create unforgettable Music City memories.",
          ctaPrimary: "Book Your Hunt",
          ctaSecondary: "Preview a Challenge",
        },
      },
      pricing: {
        pricePerPersonCents: 2995,
        minimumPlayers: 4,
        durationLabel: "2–3 hours",
        features: [],
      },
    };
  }
}

export async function getHomepageData() {
  try {
    await connectDB();
    const [faqs, testimonials, leaderboard] = await Promise.all([
      FAQ.find({ published: true }).sort({ order: 1 }).limit(6).lean(),
      Testimonial.find({ published: true }).sort({ order: 1 }).limit(8).lean(),
      LeaderboardEntry.find({ isDemo: true }).sort({ score: -1 }).limit(5).lean(),
    ]);
    return { faqs, testimonials, leaderboard };
  } catch {
    return { faqs: [], testimonials: [], leaderboard: [] };
  }
}
