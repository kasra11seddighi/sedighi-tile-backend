import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { liaraS3, LIARA_BUCKET_NAME, buildPublicUrl } from "../config/liaraStorage";

// آپلود عکس: فایل به‌صورت buffer از multer (adminUpload.middleware) میاد
// و مستقیم روی Object Storage لیارا ذخیره می‌شه؛ دیگه چیزی روی دیسک
// خودِ سرور نمی‌مونه (چون فایل‌سیستم سرور پایدار نیست و بین دیپلوی‌ها/
// چند replica مشترک نیست).
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "فایلی ارسال نشده است");
  }

  const folder = req.params.folder || "general";
  const ext = req.file.originalname.split(".").pop() || "jpg";
  const key = `${folder}/img-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  await liaraS3.send(
    new PutObjectCommand({
      Bucket: LIARA_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    }),
  );

  res.status(201).json({
    success: true,
    data: {
      url: buildPublicUrl(key),
    },
  });
});

// حذف عکس از باکت با استفاده از همون لینک عمومی که آپلود برگردونده بود
export const deleteImage = asyncHandler(async (req, res) => {
  const { url } = req.body as { url?: string };

  if (!url) {
    throw new ApiError(400, "مسیر فایل (url) ارسال نشده است");
  }

  const prefix = `${LIARA_BUCKET_NAME}/`;
  const idx = url.indexOf(prefix);

  if (idx === -1) {
    throw new ApiError(400, "مسیر فایل نامعتبر است");
  }

  const key = url.slice(idx + prefix.length);

  await liaraS3.send(
    new DeleteObjectCommand({
      Bucket: LIARA_BUCKET_NAME,
      Key: key,
    }),
  );

  res.status(200).json({
    success: true,
    message: "تصویر با موفقیت حذف شد",
  });
});
