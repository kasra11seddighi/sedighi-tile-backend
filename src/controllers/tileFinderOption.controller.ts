import { asyncHandler } from "../utils/asyncHandler";
import { createOptionService } from "../services/tileFinderOption.service";
import { TileFinderLocation } from "../models/TileFinderLocation.model";
import { TileFinderSize } from "../models/TileFinderSize.model";
import { TileFinderStyle } from "../models/TileFinderStyle.model";
import { TileFinderColor } from "../models/TileFinderColor.model";

const locationService = createOptionService(TileFinderLocation, "locations");
const sizeService = createOptionService(TileFinderSize, "sizes");
const styleService = createOptionService(TileFinderStyle, "styles");
const colorService = createOptionService(TileFinderColor, "colors");

// ===== Location =====
export const getLocations = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: await locationService.getAll() });
});
export const createLocation = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await locationService.create(req.body) });
});
export const updateLocation = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ success: true, data: await locationService.update(req.params.id, req.body) });
});
export const deleteLocation = asyncHandler(async (req, res) => {
  await locationService.remove(req.params.id);
  res.status(200).json({ success: true, message: "فضا حذف شد" });
});

// ===== Size =====
export const getSizes = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: await sizeService.getAll() });
});
export const createSize = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await sizeService.create(req.body) });
});
export const updateSize = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await sizeService.update(req.params.id, req.body) });
});
export const deleteSize = asyncHandler(async (req, res) => {
  await sizeService.remove(req.params.id);
  res.status(200).json({ success: true, message: "سایز حذف شد" });
});

// ===== Style =====
export const getStyles = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: await styleService.getAll() });
});
export const createStyle = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await styleService.create(req.body) });
});
export const updateStyle = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ success: true, data: await styleService.update(req.params.id, req.body) });
});
export const deleteStyle = asyncHandler(async (req, res) => {
  await styleService.remove(req.params.id);
  res.status(200).json({ success: true, message: "سبک حذف شد" });
});

// ===== Color =====
export const getColors = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: await colorService.getAll() });
});
export const createColor = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await colorService.create(req.body) });
});
export const updateColor = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json({ success: true, data: await colorService.update(req.params.id, req.body) });
});
export const deleteColor = asyncHandler(async (req, res) => {
  await colorService.remove(req.params.id);
  res.status(200).json({ success: true, message: "رنگ حذف شد" });
});
