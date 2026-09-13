import { Testimonial } from "../models/Testimonial.model";
import { ApiError } from "../utils/ApiError";
import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
  GetTestimonialsQuery,
} from "../validations/testimonial.validation";

// عمومی - فقط نظرات فعال، مرتب‌شده بر اساس order (مثل Faq). فرانت برای
// پیش‌نمایش صفحه‌ی اصلی با ?limit= صداش می‌زنه (نگاه کن به
// TestimonialsSection.tsx که با limit=3 فراخوانی می‌کنه)؛ اگه limit نیاد،
// همه‌ی نظرات فعال برمی‌گرده.
export const getPublicTestimonials = async (query: GetTestimonialsQuery) => {
  const { limit } = query;

  const q = Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

  if (limit) q.limit(limit);

  return q;
};

// ادمین - همه نظرات (فعال و غیرفعال)
export const getAllTestimonials = async () => {
  return Testimonial.find().sort({ order: 1, createdAt: -1 });
};

export const createTestimonial = async (data: CreateTestimonialInput) => {
  return Testimonial.create(data);
};

export const updateTestimonial = async (id: string, data: UpdateTestimonialInput) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) {
    throw new ApiError(404, "نظر مشتری یافت نشد.");
  }

  return testimonial;
};

export const deleteTestimonial = async (id: string) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);

  if (!testimonial) {
    throw new ApiError(404, "نظر مشتری یافت نشد.");
  }

  return testimonial;
};
