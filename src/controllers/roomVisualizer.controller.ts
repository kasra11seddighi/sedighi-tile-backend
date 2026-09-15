import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import * as roomVisualizerService from "../services/roomVisualizer.service";

export const suggestTile = asyncHandler(async (_req, res) => {
  const data = await roomVisualizerService.suggestTile();
  res.status(200).json(data);
});

export const applyTile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "عکس اتاق ارسال نشده است");
  }

  const { tileId } = req.body as { tileId: string };

  // عکس اتاق دیگه هیچ‌وقت روی دیسک سرور نمی‌شینه (multer با
  // memoryStorage اون رو به‌صورت buffer نگه می‌داره)، پس نیازی به
  // پاک‌سازی فایل موقت هم نیست.
  const data = await roomVisualizerService.applyTileToRoom(
    req.file.buffer,
    req.file.mimetype,
    tileId,
  );
  res.status(200).json(data);
});
