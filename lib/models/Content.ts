import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TestimonialSchema = new Schema(
  {
    name: String,
    groupType: String,
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 },
    image: String,
    isSample: { type: Boolean, default: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    seoTitle: String,
    seoDescription: String,
    heroTitle: String,
    heroSubtitle: String,
    content: String,
  },
  { timestamps: true }
);

const PageSectionSchema = new Schema(
  {
    pageSlug: { type: String, required: true },
    key: String,
    layout: { type: String, default: "default" },
    title: String,
    subtitle: String,
    body: String,
    backgroundColor: String,
    backgroundImage: String,
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    cards: [
      {
        title: String,
        description: String,
        icon: String,
        image: String,
        link: String,
        linkLabel: String,
      },
    ],
    buttons: [{ label: String, href: String, variant: String }],
  },
  { timestamps: true }
);

export type IFAQ = InferSchemaType<typeof FAQSchema> & { _id: string };
export type ITestimonial = InferSchemaType<typeof TestimonialSchema> & { _id: string };
export type IPage = InferSchemaType<typeof PageSchema> & { _id: string };
export type IPageSection = InferSchemaType<typeof PageSectionSchema> & { _id: string };

export const FAQ: Model<IFAQ> = models.FAQ || model<IFAQ>("FAQ", FAQSchema);
export const Testimonial: Model<ITestimonial> =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
export const Page: Model<IPage> = models.Page || model<IPage>("Page", PageSchema);
export const PageSection: Model<IPageSection> =
  models.PageSection || model<IPageSection>("PageSection", PageSectionSchema);
