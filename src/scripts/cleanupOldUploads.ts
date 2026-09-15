import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { liaraS3, LIARA_BUCKET_NAME } from "../config/liaraStorage";

/**
 * عکس خامِ اتاق دیگه اصلاً جایی ذخیره نمی‌شه (multer با memoryStorage
 * فقط توی حافظه‌ی همون درخواست نگه‌ش می‌داره و با پاسخ گرفتن از AI از
 * بین می‌ره). عکس‌های نتیجه‌ی نهایی هم دیگه روی دیسک سرور نیستن؛ روی
 * Liara Object Storage (پیشوند room-visualizer-results/) ذخیره می‌شن،
 * چون فایل‌سیستم اپ روی لیارا ephemeral هست.
 *
 * این اسکریپت آبجکت‌های قدیمی‌تر از MAX_AGE_DAYS رو از همون پیشوند تو
 * باکت پاک می‌کنه. پیشنهاد می‌شه با یک cron job روزانه اجرا بشه، مثلاً:
 *   0 3 * * * cd /path/to/backend && npm run cleanup:uploads
 */

const RESULTS_PREFIX = "room-visualizer-results/";
const MAX_AGE_DAYS = 7;

const run = async (): Promise<void> => {
  const maxAgeMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();

  let deleted = 0;
  let continuationToken: string | undefined;

  do {
    const listResult = await liaraS3.send(
      new ListObjectsV2Command({
        Bucket: LIARA_BUCKET_NAME,
        Prefix: RESULTS_PREFIX,
        ContinuationToken: continuationToken,
      }),
    );

    const oldObjects = (listResult.Contents ?? []).filter(
      (obj) => obj.Key && obj.LastModified && now - obj.LastModified.getTime() > maxAgeMs,
    );

    for (const obj of oldObjects) {
      await liaraS3.send(
        new DeleteObjectCommand({
          Bucket: LIARA_BUCKET_NAME,
          Key: obj.Key,
        }),
      );
      deleted += 1;
    }

    continuationToken = listResult.IsTruncated ? listResult.NextContinuationToken : undefined;
  } while (continuationToken);

  console.log(`✅ پاک‌سازی انجام شد. ${deleted} فایل قدیمی‌تر از ${MAX_AGE_DAYS} روز حذف شد.`);
};

run().catch((err) => {
  console.error("خطا در پاک‌سازی نتایج قدیمی:", err);
  process.exitCode = 1;
});
