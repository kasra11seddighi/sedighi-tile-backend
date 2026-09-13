import { asyncHandler } from "../utils/asyncHandler";
import * as brandService from "../services/Brand.service";

export const getBrands = asyncHandler(async (_req, res) => {
  const brands = await brandService.getActiveBrands();
  res.status(200).json({
    success: true,
    results: brands.length,
    data: { brands },
  });
});

export const getAllBrands = asyncHandler(async (_req, res) => {
  const brands = await brandService.getAllBrands();
  res.status(200).json({ success: true, data: brands });
});

export const createBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json({ success: true, data: brand });
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.updateBrand(req.params.id, req.body);
  res.status(200).json({ success: true, data: brand });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  await brandService.deleteBrand(req.params.id);
  res.status(200).json({ success: true, message: "برند حذف شد" });
});
