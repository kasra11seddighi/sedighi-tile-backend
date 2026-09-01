import { z } from "zod";

// برای Location / Size / Style
export const createOptionSchema = z.object({
  name: z.string().trim().min(1, "نام الزامی است"),
  slug: z.string().trim().min(1, "slug الزامی است"),
  order: z.coerce.number().optional(),
});

export const updateOptionSchema = createOptionSchema.partial();

// برای Color (یک فیلد اضافه: hex)
export const createColorOptionSchema = createOptionSchema.extend({
  hex: z.string().trim().optional(),
});

export const updateColorOptionSchema = createColorOptionSchema.partial();
