import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "شناسه نامعتبر است");

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "عنوان پروژه الزامی است"),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  completedAt: z.coerce.date().optional(),
  coverImage: z.string().trim().min(1, "تصویر شاخص پروژه الزامی است"),
  images: z.array(z.string()).optional(),
  category: objectId,
  isActive: z.boolean().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(1, "عنوان پروژه الزامی است").optional(),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  completedAt: z.coerce.date().optional(),
  coverImage: z.string().trim().min(1).optional(),
  images: z.array(z.string()).optional(),
  category: objectId.optional(),
  isActive: z.boolean().optional(),
});

// همون الگوی getProductsQuerySchema (بدون minPrice/maxPrice چون پروژه
// قیمت نداره)؛ sort فقط جدید/قدیم رو پشتیبانی می‌کنه — دقیقاً هم‌ارز
// SORT_OPTIONS ثابتی که فرانت توی ProjectFiltersBar.tsx نشون می‌ده.
export const getProjectsQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: objectId.optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  sort: z.enum(["-createdAt", "createdAt"]).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>;
