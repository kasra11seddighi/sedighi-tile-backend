import { Schema, model, Document, Types } from "mongoose";

export interface ITileFinderStyle extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const tileFinderStyleSchema = new Schema<ITileFinderStyle>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const TileFinderStyle = model<ITileFinderStyle>(
  "TileFinderStyle",
  tileFinderStyleSchema,
);
