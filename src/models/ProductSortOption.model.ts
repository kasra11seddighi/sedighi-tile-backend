import { Schema, model, Document, Types } from "mongoose";

// این مقادیر باید دقیقاً با نوع SortOption سمت فرانت و فیلدهای واقعی
// قابل استفاده در Product.find().sort() هماهنگ باشن. اضافه‌کردن یک مقدار
// جدید (مثلاً مرتب‌سازی بر اساس تعداد فروش یا امتیاز) نیاز به تغییر این
// enum و منطق getAllProducts داره؛ صرفاً یک ردیف جدید توی مانگو کافی نیست.
export const SORT_OPTION_VALUES = [
  "-createdAt",
  "createdAt",
  "price",
  "-price",
] as const;

export type ProductSortValue = (typeof SORT_OPTION_VALUES)[number];

export interface IProductSortOption extends Document {
  _id: Types.ObjectId;
  value: ProductSortValue;
  label: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSortOptionSchema = new Schema<IProductSortOption>(
  {
    value: {
      type: String,
      enum: SORT_OPTION_VALUES,
      required: true,
      unique: true,
    },
    label: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ProductSortOption = model<IProductSortOption>(
  "ProductSortOption",
  productSortOptionSchema,
);
