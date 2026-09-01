import { z } from "zod";
import { SORT_OPTION_VALUES } from "../models/ProductSortOption.model";

export const createSortOptionSchema = z.object({
  value: z.enum(SORT_OPTION_VALUES, {
    errorMap: () => ({ message: "مقدار مرتب‌سازی نامعتبر است" }),
  }),
  label: z.string().trim().min(1, "عنوان الزامی است"),
  order: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

// value عمداً توی آپدیت قابل تغییر نیست: هر گزینه دقیقاً معادل یک فیلد و
// جهت واقعی مرتب‌سازیه؛ اگه لازم شد یه گزینه رو عوض کنید، بهتره حذفش کنید
// و یکی جدید با value درست بسازید تا اشتباهی به یه مقدار نامعتبر گره نخوره.
export const updateSortOptionSchema = createSortOptionSchema
  .omit({ value: true })
  .partial();

export type CreateSortOptionInput = z.infer<typeof createSortOptionSchema>;
export type UpdateSortOptionInput = z.infer<typeof updateSortOptionSchema>;
