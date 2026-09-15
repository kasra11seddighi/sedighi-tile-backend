import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import { generateRoomWithTile } from "../utils/aiImageProvider";
import { liaraS3, LIARA_BUCKET_NAME, buildPublicUrl } from "../config/liaraStorage";

const RESULTS_PREFIX = "room-visualizer-results";

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

export const applyTileToRoom = async (
  roomImageBuffer: Buffer,
  roomImageMimeType: string,
  tileId: string,
) => {
  const product = await Product.findOne({ _id: tileId, isActive: true })
    .select("name images")
    .lean();

  if (!product) {
    throw new ApiError(404, "کاشی انتخاب‌شده یافت نشد");
  }

  const tileImageUrl = product.images?.[0];

  const prompt = `دیوار و کف این اتاق را با بافت کاشی «${product.name}» به‌صورت واقع‌گرایانه بازسازی کن؛ چیدمان، وسایل و نورپردازی اتاق باید بدون تغییر باقی بماند.`;

  const resultBuffer = await generateRoomWithTile({
    roomImageBuffer,
    roomImageMimeType,
    tileImageUrl,
    prompt,
  });

  // نتیجه‌ی نهایی هم مثل آپلودهای ادمین روی Liara Object Storage ذخیره
  // می‌شه، نه دیسک محلی سرور - چون فایل‌سیستم اپ روی لیارا ephemeral
  // هست و با هر ری‌دیپلوی/ری‌استارت پاک می‌شه و لینک نتیجه ۴۰۴ می‌شد.
  const key = `${RESULTS_PREFIX}/result-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;

  await liaraS3.send(
    new PutObjectCommand({
      Bucket: LIARA_BUCKET_NAME,
      Key: key,
      Body: resultBuffer,
      ContentType: "image/jpeg",
      ACL: "public-read",
    }),
  );

  return { resultImage: buildPublicUrl(key) };
};
