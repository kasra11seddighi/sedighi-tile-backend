import { z } from "zod";

// همه‌ی فیلترها اختیاری هستند — اگر خالی بودند، وارد کوئری Mongo نمی‌شوند
export const filterProductsSchema = z.object({
  location: z.string().trim().optional().or(z.literal("")),
  size: z.string().trim().optional().or(z.literal("")),
  brand: z.string().trim().optional().or(z.literal("")),
  style: z.string().trim().optional().or(z.literal("")),
  color: z.string().trim().optional().or(z.literal("")),
});

export type FilterProductsInput = z.infer<typeof filterProductsSchema>;
