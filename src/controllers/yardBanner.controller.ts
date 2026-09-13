import { asyncHandler } from "../utils/asyncHandler";
import * as yardBannerService from "../services/yardBanner.service";

export const getPublicYardBanners = asyncHandler(async (req, res) => {
  const banners = await yardBannerService.getPublicYardBanners(req.query as never);
  res.status(200).json({ success: true, data: banners });
});

// پنل ادمین - همه بنرها (فعال و غیرفعال)
export const getAllYardBanners = asyncHandler(async (_req, res) => {
  const banners = await yardBannerService.getAllYardBanners();
  res.status(200).json({ success: true, data: banners });
});

export const createYardBanner = asyncHandler(async (req, res) => {
  const banner = await yardBannerService.createYardBanner(req.body);
  res.status(201).json({ success: true, data: banner });
});

export const updateYardBanner = asyncHandler(async (req, res) => {
  const banner = await yardBannerService.updateYardBanner(req.params.id, req.body);
  res.status(200).json({ success: true, data: banner });
});

export const deleteYardBanner = asyncHandler(async (req, res) => {
  await yardBannerService.deleteYardBanner(req.params.id);
  res.status(200).json({ success: true, message: "بنر حذف شد." });
});
