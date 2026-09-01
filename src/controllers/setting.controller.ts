import { asyncHandler } from "../utils/asyncHandler";
import * as settingService from "../services/setting.service";

export const getHeader = asyncHandler(async (_req, res) => {
  const data = await settingService.getHeader();
  res.status(200).json({ success: true, data });
});

export const getFooter = asyncHandler(async (_req, res) => {
  const data = await settingService.getFooter();
  res.status(200).json({ success: true, data });
});

export const updateSetting = asyncHandler(async (req, res) => {
  const data = await settingService.updateSetting(req.body);
  res.status(200).json({ success: true, data });
});
