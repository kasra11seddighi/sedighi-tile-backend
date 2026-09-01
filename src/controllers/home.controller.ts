import { asyncHandler } from "../utils/asyncHandler";
import * as homeService from "../services/home.service";

export const getHome = asyncHandler(async (_req, res) => {
  const home = await homeService.getHomeData();
  res.status(200).json({ success: true, data: home });
});

export const updateHome = asyncHandler(async (req, res) => {
  const home = await homeService.updateHomeData(req.body);
  res.status(200).json({ success: true, data: home });
});
