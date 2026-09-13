import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  comment: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    // مثلاً «معمار» یا نام شهر/محله؛ اختیاریه
    role: { type: String, trim: true },
    avatar: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    // برای چیدمان دستی از پنل ادمین، دقیقاً هم‌الگو با order توی Faq
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
