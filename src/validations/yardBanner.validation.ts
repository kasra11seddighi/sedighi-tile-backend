import { z } from "zod";

export const createYardBannerSchema = z.object({
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  image: z.string().trim().min(1, "عکس بنر الزامی است"),
  alt: z.string().trim().optional(),
  link: z.string().trim().optional(),
  order: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export const updateYardBannerSchema = createYardBannerSchema.partial();

// عمومی - فرانت با ?limit= بنرهای این بخش رو محدود می‌کنه (مثلاً فقط ۴ تا)
export const getYardBannersQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(20).optional(),
});

export type CreateYardBannerInput = z.infer<typeof createYardBannerSchema>;
export type UpdateYardBannerInput = z.infer<typeof updateYardBannerSchema>;
export type GetYardBannersQuery = z.infer<typeof getYardBannersQuerySchema>;
