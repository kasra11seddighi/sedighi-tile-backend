import { Schema, model, Document, Types } from "mongoose";

// یک رنگ/واریانت مستقل از همین کاشی؛ برخلاف colors (که فقط تگ فیلتریه و
// از TileFinderColor میاد)، اینجا هر رنگ کد و موجودی خودش رو داره، انگار
// یک زیرمحصول کوچیکه.
export interface IProductColorVariant {
  _id: Types.ObjectId;
  name: string;
  hex?: string;
  image?: string;
  code: string;
  stock: number;
}

// مقدار محصول برای یک مرحله‌ی «سفارشی» فایندر کاشی (مثلاً «کف یا دیوار»).
// برخلاف locations/sizes/styles/colors که هرکدوم فیلد و مدل ثابت خودشون رو
// دارن، مراحل سفارشی همگی از همین یک ساختار عمومی استفاده می‌کنن؛ هر آیتم
// می‌گه «این محصول توی مرحله‌ی X این گزینه‌ها رو داره».
export interface IProductCustomAttribute {
  step: Types.ObjectId;
  options: Types.ObjectId[];
}

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

  // مقادیر محصول برای مراحل سفارشی فایندر (منبع: TileFinderCustomOption)
  customAttributes: IProductCustomAttribute[];

  // رنگ‌های واقعی و مستقل همین محصول که کاربر توی صفحه محصول انتخاب
  // می‌کنه؛ هر کدوم کد و موجودی جدا داره
  colorVariants: IProductColorVariant[];

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

  // --- مشخصات فنی نمایشی (جدول «مشخصات فنی» توی صفحه‌ی محصول) ---
  // همه اختیاری‌اند چون هر دسته‌بندی (کاشی، شیرآلات و...) زیرمجموعه‌ی
  // متفاوتی از این‌ها رو پر می‌کنه؛ هر کدوم خالی باشه توی جدول نمایش داده نمی‌شه.
  glazeType?: string; // نوع لعاب
  bodyMaterial?: string; // جنس بدنه
  wearResistance?: string; // مقاومت در برابر سایش (مثلاً «PEI 4»)
  suitableFor?: string[]; // مناسب برای (کف، دیوار، نما، استخر و...)
  colorDescription?: string; // توضیح متنی رنگ اصلی محصول (برای جدول مشخصات، جدا از colorVariants)
  sku?: string; // کد محصول
  thickness?: number; // ضخامت (میلی‌متر)
  finish?: string; // نوع سطح (مات/براق/میکس و...)
  qualityGrade?: string; // درجه کیفیت
  originCountry?: string; // کشور/کارخانه سازنده
  weightPerCarton?: number; // وزن هر کارتن (کیلوگرم)
  waterAbsorption?: string; // میزان جذب آب
  warranty?: string; // گارانتی/ضمانت

  createdAt: Date;
  updatedAt: Date;
}

const customAttributeSchema = new Schema<IProductCustomAttribute>(
  {
    step: { type: Schema.Types.ObjectId, ref: "TileFinderStep", required: true },
    options: [{ type: Schema.Types.ObjectId, ref: "TileFinderCustomOption" }],
  },
  { _id: false },
);

const colorVariantSchema = new Schema<IProductColorVariant>({
  name: { type: String, required: true, trim: true },
  hex: { type: String },
  image: { type: String },
  code: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
});

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

    // مقادیر محصول برای مراحل سفارشی فایندر
    customAttributes: { type: [customAttributeSchema], default: [] },

    // رنگ‌های مستقل محصول (هر کدوم کد/موجودی خودش رو داره)
    colorVariants: [colorVariantSchema],

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

    // --- مشخصات فنی نمایشی ---
    glazeType: { type: String, trim: true },
    bodyMaterial: { type: String, trim: true },
    wearResistance: { type: String, trim: true },
    suitableFor: [{ type: String, trim: true }],
    colorDescription: { type: String, trim: true },
    sku: { type: String, trim: true },
    thickness: { type: Number, min: 0 },
    finish: { type: String, trim: true },
    qualityGrade: { type: String, trim: true },
    originCountry: { type: String, trim: true },
    weightPerCarton: { type: Number, min: 0 },
    waterAbsorption: { type: String, trim: true },
    warranty: { type: String, trim: true },
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
productSchema.index({ "customAttributes.step": 1, "customAttributes.options": 1 });

export const Product = model<IProduct>("Product", productSchema);
