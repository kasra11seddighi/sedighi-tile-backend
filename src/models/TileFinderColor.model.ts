import { Schema, model, Document, Types } from "mongoose";

export interface ITileFinderColor extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  hex: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const tileFinderColorSchema = new Schema<ITileFinderColor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    hex: { type: String, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const TileFinderColor = model<ITileFinderColor>(
  "TileFinderColor",
  tileFinderColorSchema,
);
