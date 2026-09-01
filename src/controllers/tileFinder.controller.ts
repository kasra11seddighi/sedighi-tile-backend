import { asyncHandler } from "../utils/asyncHandler";
import * as tileFinderService from "../services/tileFinder.service";

// توجه: خروجی این کنترلرها عمداً «آرایه‌ی خام» است (نه {success,data})
// چون فرانت فعلی دقیقاً همین فرمت را انتظار دارد.

export const getLocations = asyncHandler(async (_req, res) => {
  const data = await tileFinderService.getLocations();
  res.status(200).json(data);
});

export const getSizes = asyncHandler(async (_req, res) => {
  const data = await tileFinderService.getSizes();
  res.status(200).json(data);
});

export const getBrands = asyncHandler(async (_req, res) => {
  const data = await tileFinderService.getBrands();
  res.status(200).json(data);
});

export const getStyles = asyncHandler(async (_req, res) => {
  const data = await tileFinderService.getStyles();
  res.status(200).json(data);
});

export const getColors = asyncHandler(async (_req, res) => {
  const data = await tileFinderService.getColors();
  res.status(200).json(data);
});

export const getProducts = asyncHandler(async (_req, res) => {
  const products = await tileFinderService.getProducts();
  res.status(200).json(products);
});

export const filterProducts = asyncHandler(async (req, res) => {
  const products = await tileFinderService.filterProducts(req.body);
  res.status(200).json(products);
});
