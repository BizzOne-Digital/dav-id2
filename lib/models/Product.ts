import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    productType: {
      type: String,
      enum: ["hunt_ticket", "gift_card", "voucher", "seasonal_pass", "deposit", "merchandise"],
      required: true,
    },
    priceCents: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    image: String,
    active: { type: Boolean, default: true },
    inventory: Number,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export type IProduct = InferSchemaType<typeof ProductSchema> & { _id: string };

export const Product: Model<IProduct> = models.Product || model<IProduct>("Product", ProductSchema);
