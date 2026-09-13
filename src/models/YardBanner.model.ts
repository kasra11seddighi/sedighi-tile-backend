import { Schema, model, Document } from "mongoose";

// بخش «بیرون از خانه» در صفحه‌ی اصلی، درست زیر بخش هوش مصنوعی.
// هر بنر یک عکس (کاشی استخر/حیاط/نما که توسط هوش مصنوعی ساخته شده)
// به همراه عنوان و لینک اختیاری داره. دقیقاً هم‌الگو با Testimonial/Faq
// که order و isActive دارن تا از پنل ادمین قابل چیدمان و فعال/غیرفعال باشن.
export interface IYardBanner extends Document {
  title?: string;
  subtitle?: string;
  image: string;
  alt?: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const yardBannerSchema = new Schema<IYardBanner>(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    // مسیر عمومی عکس؛ برای بنرهای پیش‌فرض چیزی شبیه
    // "/images/yard/banner1.jpg" (فایل‌هایی که از پیش در public قرار گرفتن)
    // ولی می‌تونه از طریق /api/uploads/yard هم آپلود و جایگزین بشه.
    image: { type: String, required: [true, "عکس بنر الزامی است"], trim: true },
    alt: { type: String, trim: true, default: "" },
    link: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const YardBanner = model<IYardBanner>("YardBanner", yardBannerSchema);
