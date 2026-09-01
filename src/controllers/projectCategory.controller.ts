import { asyncHandler } from "../utils/asyncHandler";
import * as projectCategoryService from "../services/projectCategory.service";

export const getProjectCategories = asyncHandler(async (_req, res) => {
  const categories = await projectCategoryService.getAllProjectCategories();
  res.status(200).json({ success: true, data: categories });
});

export const getProjectCategory = asyncHandler(async (req, res) => {
  const category = await projectCategoryService.getProjectCategoryById(req.params.id);
  res.status(200).json({ success: true, data: category });
});

export const createProjectCategory = asyncHandler(async (req, res) => {
  const category = await projectCategoryService.createProjectCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateProjectCategory = asyncHandler(async (req, res) => {
  const category = await projectCategoryService.updateProjectCategory(
    req.params.id,
    req.body,
  );
  res.status(200).json({ success: true, data: category });
});

export const deleteProjectCategory = asyncHandler(async (req, res) => {
  await projectCategoryService.deleteProjectCategory(req.params.id);
  res.status(200).json({ success: true, message: "دسته‌بندی پروژه حذف شد." });
});
