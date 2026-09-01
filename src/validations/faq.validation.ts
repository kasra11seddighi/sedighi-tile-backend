import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().trim().min(3, "سوال باید حداقل ۳ کاراکتر باشد"),
  answer: z.string().trim().min(3, "پاسخ باید حداقل ۳ کاراکتر باشد"),
  order: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateFaqSchema = createFaqSchema.partial();

export type CreateFaqInput = z.infer<typeof createFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
