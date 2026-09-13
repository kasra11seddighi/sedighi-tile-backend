import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;

  // آیا قیمت محصولات این دسته‌بندی روی سایت نمایش داده بشه یا نه.
  // پیش‌فرض false: فعلاً قیمت هیچ‌جا نشون داده نمی‌شه و به‌جاش دکمه‌ی
  // «تماس بگیرید» نشون داده می‌شه؛ از داشبورد ادمین قابل تغییر برای هر
  // دسته‌بندی به‌صورت جداگانه‌ست (مثلاً بعداً فقط برای شیرآلات فعال بشه).
  showPrice: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    showPrice: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Category = model<ICategory>("Category", categorySchema);
