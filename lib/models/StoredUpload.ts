import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { UPLOAD_FOLDERS } from "@/lib/uploads/constants";

const StoredUploadSchema = new Schema(
  {
    folder: { type: String, required: true, enum: UPLOAD_FOLDERS },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type IStoredUpload = InferSchemaType<typeof StoredUploadSchema> & { _id: string };

export const StoredUpload: Model<IStoredUpload> =
  models.StoredUpload || model<IStoredUpload>("StoredUpload", StoredUploadSchema);

export type { UploadFolder } from "@/lib/uploads/constants";
