import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { connectDB } from "@/lib/db/connect";
import { FAQ } from "@/lib/models/Content";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ",
  description: "Answers about booking, gameplay, weather, group size, and corporate hunts in Music City.",
  path: "/faq",
});

const FALLBACK = [
  {
    id: "1",
    question: "How long does a hunt take?",
    answer: "Most groups finish in 2–3 hours depending on pace and group size.",
  },
  {
    id: "2",
    question: "Do we need an app?",
    answer: "No app required—players use a mobile browser to join and submit answers.",
  },
];

export default async function FaqPage() {
  let items = FALLBACK;

  try {
    await connectDB();
    const faqs = await FAQ.find({ published: true }).sort({ order: 1 }).lean();
    if (faqs.length) {
      items = faqs.map((f) => ({
        id: String(f._id),
        question: f.question,
        answer: f.answer,
      }));
    }
  } catch {
    // use fallback
  }

  return (
    <PageTransition>
      <PageHero
        title="Frequently asked questions"
        subtitle="Everything you need before you round up your team."
        backgroundImage={PAGE_HERO_IMAGES.faq}
      />
      <section className="section-y bg-charcoal">
        <div className="site-x mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="We've got answers" align="left" />
          <FaqAccordion items={items} />
        </div>
      </section>
    </PageTransition>
  );
}
