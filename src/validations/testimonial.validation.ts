import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  role: z.string().trim().optional(),
  avatar: z.string().trim().optional(),
  rating: z.coerce.number().min(1, "امتیاز باید بین ۱ تا ۵ باشد").max(5, "امتیاز باید بین ۱ تا ۵ باشد"),
  comment: z.string().trim().min(5, "متن نظر باید حداقل ۵ کاراکتر باشد"),
  order: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

// عمومی - فقط برای پیش‌نمایش (مثلاً صفحه‌ی اصلی) که فرانت با ?limit=
// صداش می‌زنه؛ نگاه کن به useTestimonials.ts فرانت.
export const getTestimonialsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional(),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type GetTestimonialsQuery = z.infer<typeof getTestimonialsQuerySchema>;
