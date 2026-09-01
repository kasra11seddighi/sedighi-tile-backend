import { asyncHandler } from "../utils/asyncHandler";
import * as categoryService from "../services/category.service";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({ success: true, data: categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json({ success: true, message: "دسته‌بندی حذف شد." });
});
