import fs from "fs";
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

  try {
    const data = await roomVisualizerService.applyTileToRoom(req.file.path, tileId);
    res.status(200).json(data);
  } finally {
    // عکس خامِ اتاق بعد از استفاده (چه موفق چه ناموفق) دیگه لازم نیست؛
    // پاکش می‌کنیم تا دیسک server پر نشه. نتیجه‌ی نهایی جداگانه توی
    // uploads/results ذخیره می‌مونه.
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("خطا در حذف فایل موقت عکس اتاق:", err.message);
    });
  }
});
