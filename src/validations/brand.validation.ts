import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().trim().min(1, "نام برند الزامی است"),
  logo: z.string().trim().min(1, "لوگوی برند الزامی است"),
  shortDescription: z
    .string()
    .trim()
    .min(1, "توضیح کوتاه برند الزامی است")
    .max(180, "توضیح برند نمی‌تواند بیشتر از ۱۸۰ کاراکتر باشد"),
  order: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
