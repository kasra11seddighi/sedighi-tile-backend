import { z } from "zod";

export const createCustomOptionSchema = z.object({
  name: z.string().trim().min(1, "نام الزامی است"),
  slug: z.string().trim().min(1, "slug الزامی است"),
  hex: z.string().trim().optional(),
  image: z.string().trim().optional(),
  order: z.coerce.number().optional(),
});

export const updateCustomOptionSchema = createCustomOptionSchema.partial();

export type CreateCustomOptionInput = z.infer<typeof createCustomOptionSchema>;
export type UpdateCustomOptionInput = z.infer<typeof updateCustomOptionSchema>;
