export type StaticPageContent = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  content: string;
};

export const POLICY_FALLBACKS: Record<string, StaticPageContent> = {
  safety: {
    slug: "safety",
    title: "Safety",
    seoTitle: "Safety Guidelines",
    seoDescription:
      "How we keep Nashville scavenger hunts fun and safe for every group—weather, walking, and supervision tips.",
    heroTitle: "Play smart in Music City",
    heroSubtitle: "Our hunts are designed for walkable downtown routes with clear safety expectations.",
    content: `
      <h2>Before you start</h2>
      <p>Wear comfortable shoes, bring water, and keep phones charged. Groups are responsible for supervising minors at all times.</p>
      <h2>Traffic &amp; crossings</h2>
      <p>Follow Nashville pedestrian signals. Do not run across Broadway or busy intersections while solving clues.</p>
      <h2>Weather</h2>
      <p>Hunts continue in light rain. We pause or reschedule for lightning, ice, or unsafe conditions.</p>
      <h2>Alcohol-free options</h2>
      <p>Request alcohol-free routing during booking—we avoid bar-heavy paths when needed.</p>
      <h2>Emergencies</h2>
      <p>Call 911 for emergencies. For hunt-day support, use the contact number in your confirmation email.</p>
    `,
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    seoTitle: "Terms of Service",
    seoDescription: "Terms governing bookings, participation, and use of Nashville Scavenger Hunt services.",
    heroTitle: "Terms of Service",
    heroSubtitle: "Please read before booking or joining a hunt.",
    content: `
      <h2>Bookings</h2>
      <p>Confirmed bookings are subject to availability. You agree to provide accurate group size and contact information.</p>
      <h2>Participation</h2>
      <p>Players must follow local laws, respect businesses, and behave responsibly in public spaces.</p>
      <h2>Content &amp; photos</h2>
      <p>Challenge submissions may be used for leaderboards and marketing unless you opt out in writing.</p>
      <h2>Liability</h2>
      <p>Activities involve walking outdoors. Participation is at your own risk to the extent permitted by Tennessee law.</p>
      <h2>Changes</h2>
      <p>We may update these terms; the version in effect at booking applies to your event.</p>
    `,
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    seoTitle: "Privacy Policy",
    seoDescription: "How Nashville Scavenger Hunt collects, uses, and protects your personal information.",
    heroTitle: "Privacy Policy",
    heroSubtitle: "We collect only what we need to run great hunts.",
    content: `
      <h2>Information we collect</h2>
      <p>Booking details (name, email, phone), team names, and gameplay submissions you provide through our platform.</p>
      <h2>How we use it</h2>
      <p>To operate hunts, send confirmations, display leaderboards, and improve our routes and challenges.</p>
      <h2>Sharing</h2>
      <p>We use payment and email providers (e.g. Stripe, email delivery) who process data on our behalf. We do not sell personal information.</p>
      <h2>Retention</h2>
      <p>We retain booking records as needed for operations, taxes, and support.</p>
      <h2>Contact</h2>
      <p>Request access or deletion via our contact page—we will respond within a reasonable time.</p>
    `,
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund Policy",
    seoTitle: "Refund & Cancellation Policy",
    seoDescription: "Cancellation windows, rescheduling, and refund eligibility for Nashville scavenger hunt bookings.",
    heroTitle: "Refunds & cancellations",
    heroSubtitle: "Flexible rescheduling when plans change.",
    content: `
      <h2>Free reschedule</h2>
      <p>Move your hunt date at no charge with at least 48 hours notice, subject to availability.</p>
      <h2>Cancellations</h2>
      <p>Cancellations more than 7 days before your event may receive a full refund minus processing fees. Later cancellations may receive credit toward a future hunt.</p>
      <h2>Weather</h2>
      <p>If we cancel due to unsafe weather, you may reschedule or receive a full refund.</p>
      <h2>No-shows</h2>
      <p>Groups that do not arrive without notice are not eligible for refunds.</p>
      <h2>Questions</h2>
      <p>Email us with your booking reference for help with any exception.</p>
    `,
  },
  about: {
    slug: "about",
    title: "About Us",
    seoTitle: "About Nashville Scavenger Hunt",
    seoDescription: "Locally written clues, fair routes, and unforgettable team adventures in downtown Nashville.",
    heroTitle: "We turn Music City into your game board",
    heroSubtitle: "Designed by Nashvillians who love stories, street art, and a little friendly competition.",
    content: `
      <p>Nashville Scavenger Hunt creates mobile adventures for families, friends, bachelorette parties, and corporate teams.</p>
      <p>Every route is walkable, phone-friendly, and packed with Music City flavor—from honky-tonk history to hidden murals.</p>
      <p>Book online, split into teams, and chase the leaderboard. When you finish, celebrate with a completion certificate worthy of Broadway.</p>
    `,
  },
  "how-it-works": {
    slug: "how-it-works",
    title: "How It Works",
    seoTitle: "How Our Scavenger Hunts Work",
    seoDescription:
      "Book online, get team codes, solve downtown clues, and climb the live leaderboard—no app download required.",
    heroTitle: "From booking to victory lap",
    heroSubtitle: "Eight simple steps from your couch to the top of the leaderboard.",
    content: `
      <p>Choose your hunt and date, gather your crew, and we send join codes before start time.</p>
      <p>On hunt day, open the link in any mobile browser, follow GPS-guided stops, and submit answers and photo challenges.</p>
      <p>Scores update live. Finish all stops, claim your rank, and keep exploring Nashville afterward.</p>
    `,
  },
};
