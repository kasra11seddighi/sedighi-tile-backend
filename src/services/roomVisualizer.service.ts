import fs from "fs";
import path from "path";
import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import { generateRoomWithTile } from "../utils/aiImageProvider";

const RESULTS_DIR = path.join(process.cwd(), "public", "uploads", "results");

if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// ===============================
// SUGGEST TILE
// پیشنهاد یک کاشی از کاتالوگ موجود.
// فعلاً یک انتخاب ساده از محصولات فعال است؛ در آینده می‌توان این بخش را
// به یک مدل بینایی ماشین (تحلیل رنگ/نور عکس اتاق) وصل کرد.
// ===============================

export const suggestTile = async () => {
  const count = await Product.countDocuments({
    isActive: true,
    images: { $exists: true, $ne: [] },
  });

  if (count === 0) {
    throw new ApiError(404, "محصولی برای پیشنهاد پیدا نشد");
  }

  const randomSkip = Math.floor(Math.random() * count);

  const product = await Product.findOne({
    isActive: true,
    images: { $exists: true, $ne: [] },
  })
    .skip(randomSkip)
    .select("name images")
    .lean();

  if (!product) {
    throw new ApiError(404, "محصولی برای پیشنهاد پیدا نشد");
  }

  return {
    tileId: product._id.toString(),
    title: product.name,
    image: product.images?.[0] ?? null,
  };
};

// ===============================
// APPLY TILE
// اعمال بافت کاشی انتخابی روی عکس اتاق کاربر با هوش مصنوعی
// ===============================

export const applyTileToRoom = async (roomImagePath: string, tileId: string) => {
  const product = await Product.findOne({ _id: tileId, isActive: true })
    .select("name images")
    .lean();

  if (!product) {
    throw new ApiError(404, "کاشی انتخاب‌شده یافت نشد");
  }

  const tileImageUrl = product.images?.[0];

  const prompt = `دیوار و کف این اتاق را با بافت کاشی «${product.name}» به‌صورت واقع‌گرایانه بازسازی کن؛ چیدمان، وسایل و نورپردازی اتاق باید بدون تغییر باقی بماند.`;

  const resultBuffer = await generateRoomWithTile({
    roomImagePath,
    tileImageUrl,
    prompt,
  });

  const fileName = `result-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const filePath = path.join(RESULTS_DIR, fileName);
  fs.writeFileSync(filePath, resultBuffer);

  return { resultImage: `/uploads/results/${fileName}` };
};
