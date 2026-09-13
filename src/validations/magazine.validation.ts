import { z } from "zod";

// tags از فرم ادمین به‌صورت یک رشته‌ی کاما-جدا میاد (مثلاً "کاشی, سرامیک")؛
// اینجا به آرایه‌ی رشته‌ی تمیز تبدیلش می‌کنیم.
const tagsField = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((t) => t.trim()).filter(Boolean);
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  });

export const createMagazineSchema = z.object({
  title: z.string().trim().min(1, "عنوان مقاله الزامی است"),
  slug: z.string().trim().min(1).optional(),
  excerpt: z
    .string()
    .trim()
    .min(1, "خلاصه‌ی مقاله الزامی است")
    .max(280, "خلاصه نمی‌تواند بیشتر از ۲۸۰ کاراکتر باشد"),
  content: z.string().trim().min(1, "متن کامل مقاله الزامی است"),
  coverImage: z.string().trim().min(1, "عکس کاور الزامی است"),
  author: z.string().trim().optional(),
  readTime: z.string().trim().optional(),
  tags: tagsField,
  isPublished: z.boolean().optional(),
});

export const updateMagazineSchema = createMagazineSchema.partial();

export type CreateMagazineInput = z.infer<typeof createMagazineSchema>;
export type UpdateMagazineInput = z.infer<typeof updateMagazineSchema>;
