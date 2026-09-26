import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const RouteRecipeSchema = new Schema(
  {
    name: { type: String, required: true },
    groupType: { type: String, required: true },
    categories: [
      {
        category: String,
        count: Number,
      },
    ],
    rules: {
      noAdultInteriors: { type: Boolean, default: false },
      maxWalkingMinutes: Number,
    },
    active: { type: Boolean, default: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export type IRouteRecipe = InferSchemaType<typeof RouteRecipeSchema> & { _id: string };

export const RouteRecipe: Model<IRouteRecipe> =
  models.RouteRecipe || model<IRouteRecipe>("RouteRecipe", RouteRecipeSchema);
