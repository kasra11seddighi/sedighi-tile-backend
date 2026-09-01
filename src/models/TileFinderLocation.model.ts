import { Schema, model, Document, Types } from "mongoose";

export interface ITileFinderLocation extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const tileFinderLocationSchema = new Schema<ITileFinderLocation>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const TileFinderLocation = model<ITileFinderLocation>(
  "TileFinderLocation",
  tileFinderLocationSchema,
);
