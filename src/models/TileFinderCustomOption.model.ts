import { Schema, model, Document, Types } from "mongoose";

// گزینه‌های مراحل «سفارشی» فایندر کاشی (مثلاً مرحله‌ی «کف یا دیوار»).
// برخلاف Location/Size/Style/Color که هر کدوم یک مدل مجزا و از پیش
// تعریف‌شده دارن، این مدل عمومیه: هر مرحله‌ی سفارشی که ادمین از پنل
// می‌سازه، گزینه‌هاش رو با رفرنس به همون مرحله (step) توی همین یک مدل
// ذخیره می‌کنه. این‌طوری اضافه‌کردن یک نوع مرحله‌ی کاملاً جدید نیازی به
// تغییر کد نداره.
export interface ITileFinderCustomOption extends Document {
  _id: Types.ObjectId;
  step: Types.ObjectId;
  name: string;
  slug: string;
  hex?: string;
  image?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const tileFinderCustomOptionSchema = new Schema<ITileFinderCustomOption>(
  {
    step: {
      type: Schema.Types.ObjectId,
      ref: "TileFinderStep",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    hex: { type: String, trim: true },
    image: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

tileFinderCustomOptionSchema.index({ step: 1, order: 1, name: 1 });

export const TileFinderCustomOption = model<ITileFinderCustomOption>(
  "TileFinderCustomOption",
  tileFinderCustomOptionSchema,
);
