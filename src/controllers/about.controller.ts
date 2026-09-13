import { asyncHandler } from "../utils/asyncHandler";
import * as aboutService from "../services/about.service";

export const getAbout = asyncHandler(async (_req, res) => {
  const data = await aboutService.getAboutContent();
  res.status(200).json({ success: true, data });
});

export const updateAbout = asyncHandler(async (req, res) => {
  const data = await aboutService.updateAboutContent(req.body);
  res.status(200).json({ success: true, data });
});
