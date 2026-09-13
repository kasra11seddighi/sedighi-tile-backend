import { asyncHandler } from "../utils/asyncHandler";
import * as magazineService from "../services/magazine.service";

export const getMagazines = asyncHandler(async (_req, res) => {
  const articles = await magazineService.getPublishedMagazines();
  res.status(200).json({ success: true, results: articles.length, data: articles });
});

export const getMagazineBySlug = asyncHandler(async (req, res) => {
  const article = await magazineService.getMagazineBySlug(req.params.slug);
  res.status(200).json({ success: true, data: article });
});

export const getAllMagazines = asyncHandler(async (_req, res) => {
  const articles = await magazineService.getAllMagazines();
  res.status(200).json({ success: true, data: articles });
});

export const createMagazine = asyncHandler(async (req, res) => {
  const article = await magazineService.createMagazine(req.body);
  res.status(201).json({ success: true, data: article });
});

export const updateMagazine = asyncHandler(async (req, res) => {
  const article = await magazineService.updateMagazine(req.params.id, req.body);
  res.status(200).json({ success: true, data: article });
});

export const deleteMagazine = asyncHandler(async (req, res) => {
  await magazineService.deleteMagazine(req.params.id);
  res.status(200).json({ success: true, message: "مقاله حذف شد" });
});
