import { Schema, model, Document, Types } from "mongoose";

export interface ITileFinderSize extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const tileFinderSizeSchema = new Schema<ITileFinderSize>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const TileFinderSize = model<ITileFinderSize>(
  "TileFinderSize",
  tileFinderSizeSchema,
);
