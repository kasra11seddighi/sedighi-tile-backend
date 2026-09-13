import { Schema, model, Document, Types } from "mongoose";

export type TileFinderStepSource =
  | "locations"
  | "sizes"
  | "brands"
  | "styles"
  | "colors"
  | "custom";

export interface ITileFinderStep extends Document {
  _id: Types.ObjectId;
  title: string;
  source: TileFinderStepSource;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tileFinderStepSchema = new Schema<ITileFinderStep>(
  {
    title: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ["locations", "sizes", "brands", "styles", "colors", "custom"],
      required: true,
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

tileFinderStepSchema.index({ order: 1, isActive: 1 });

export const TileFinderStep = model<ITileFinderStep>(
  "TileFinderStep",
  tileFinderStepSchema,
);
