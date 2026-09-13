import { z } from "zod";

// همه‌ی فیلترها اختیاری هستند — اگر خالی بودند، وارد کوئری Mongo نمی‌شوند
export const filterProductsSchema = z.object({
  location: z.string().trim().optional().or(z.literal("")),
  size: z.string().trim().optional().or(z.literal("")),
  brand: z.string().trim().optional().or(z.literal("")),
  style: z.string().trim().optional().or(z.literal("")),
  color: z.string().trim().optional().or(z.literal("")),
  // انتخاب‌های مربوط به مراحل «سفارشی» فایندر (مثلاً «کف یا دیوار»)؛
  // هر آیتم می‌گه «برای مرحله‌ی X، گزینه‌ی Y انتخاب شده».
  custom: z
    .array(
      z.object({
        step: z.string().trim().min(1),
        option: z.string().trim().min(1),
      }),
    )
    .optional(),
});

export type FilterProductsInput = z.infer<typeof filterProductsSchema>;
