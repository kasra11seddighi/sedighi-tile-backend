import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "نام دسته‌بندی الزامی است"),
  description: z.string().trim().optional(),
  showPrice: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  showPrice: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
