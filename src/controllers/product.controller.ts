import { asyncHandler } from "../utils/asyncHandler";
import * as productService from "../services/product.service";

export const getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query as never);
  res.status(200).json({ success: true, ...result });
});

// پنل ادمین - همه محصولات (فعال و غیرفعال)، بدون صفحه‌بندی
export const getAllProductsAdmin = asyncHandler(async (_req, res) => {
  const products = await productService.getAllProductsAdmin();
  res.status(200).json({ success: true, data: products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json({ success: true, message: "محصول حذف شد." });
});
