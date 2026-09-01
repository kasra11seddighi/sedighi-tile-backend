import { asyncHandler } from "../utils/asyncHandler";
import * as sortOptionService from "../services/productSortOption.service";

// عمومی — برای دراپ‌داون مرتب‌سازی صفحه‌ی محصولات (بدون نیاز به لاگین)
export const getSortOptions = asyncHandler(async (_req, res) => {
  const data = await sortOptionService.getActiveSortOptions();
  res.status(200).json({ success: true, data });
});

// ادمین — همه‌ی گزینه‌ها (فعال و غیرفعال) برای لیست داشبورد
export const getSortOptionsAdmin = asyncHandler(async (_req, res) => {
  const data = await sortOptionService.getAllSortOptionsAdmin();
  res.status(200).json({ success: true, data });
});

export const createSortOption = asyncHandler(async (req, res) => {
  const data = await sortOptionService.createSortOption(req.body);
  res.status(201).json({ success: true, data });
});

export const updateSortOption = asyncHandler(async (req, res) => {
  const data = await sortOptionService.updateSortOption(
    req.params.id,
    req.body,
  );
  res.status(200).json({ success: true, data });
});

export const deleteSortOption = asyncHandler(async (req, res) => {
  await sortOptionService.deleteSortOption(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "گزینه‌ی مرتب‌سازی حذف شد." });
});
