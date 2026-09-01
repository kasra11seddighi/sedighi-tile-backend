import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[];
  category: Types.ObjectId;
  brand: Types.ObjectId | null;
  locations: Types.ObjectId[];
  sizes: Types.ObjectId[];
  styles: Types.ObjectId[];
  colors: Types.ObjectId[];
  isActive: boolean;

  // --- فروش متری/کارتنی (مخصوص محصولات کاشی و سرامیک) ---
  // این فیلدها اختیاری‌اند: محصولاتی که saleUnit ندارن، دقیقاً مثل قبل
  // با همون price/discountPrice و به‌صورت تکی (quantity) فروخته می‌شن.
  pricePerM2?: number;
  pricePerCarton?: number;
  piecesPerCarton?: number;
  m2PerCarton?: number;
  tileWidth?: number;
  tileHeight?: number;
  saleUnit?: "m2" | "carton" | "both";

  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // برند
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },

    // مکان / فضای مناسب — منبع اصلی: TileFinderLocation
    locations: [{ type: Schema.Types.ObjectId, ref: "TileFinderLocation" }],

    // سایز — منبع اصلی: TileFinderSize
    sizes: [{ type: Schema.Types.ObjectId, ref: "TileFinderSize" }],

    // سبک — منبع اصلی: TileFinderStyle
    styles: [{ type: Schema.Types.ObjectId, ref: "TileFinderStyle" }],

    // رنگ — منبع اصلی: TileFinderColor
    colors: [{ type: Schema.Types.ObjectId, ref: "TileFinderColor" }],

    isActive: { type: Boolean, default: true },

    // --- فروش متری/کارتنی ---
    // مقدار مستقل از pricePerCarton؛ هیچ‌کدوم از روی دیگری محاسبه نمی‌شه
    pricePerM2: { type: Number, min: 0 },
    pricePerCarton: { type: Number, min: 0 },
    piecesPerCarton: { type: Number, min: 0 },
    m2PerCarton: { type: Number, min: 0 },
    tileWidth: { type: Number, min: 0 },
    tileHeight: { type: Number, min: 0 },
    saleUnit: {
      type: String,
      enum: ["m2", "carton", "both"],
      required: false,
    },
  },
  { timestamps: true },
);

// جستجوی متنی
productSchema.index({ name: "text", description: "text" });

// Indexهای Tile Finder
productSchema.index({ brand: 1 });
productSchema.index({ locations: 1 });
productSchema.index({ sizes: 1 });
productSchema.index({ styles: 1 });
productSchema.index({ colors: 1 });

export const Product = model<IProduct>("Product", productSchema);
