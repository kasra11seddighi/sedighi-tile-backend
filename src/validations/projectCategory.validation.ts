import { z } from "zod";

export const createProjectCategorySchema = z.object({
  name: z.string().trim().min(1, "نام دسته‌بندی الزامی است"),
  description: z.string().trim().optional(),
});

export const updateProjectCategorySchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
});

export type CreateProjectCategoryInput = z.infer<typeof createProjectCategorySchema>;
export type UpdateProjectCategoryInput = z.infer<typeof updateProjectCategorySchema>;
