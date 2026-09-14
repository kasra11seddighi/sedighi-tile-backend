import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

// لیارا Object Storage با پروتکل S3 سازگاره، برای همین از همون
// AWS SDK استفاده می‌کنیم اما endpoint رو به سرور لیارا اشاره می‌دیم.
export const liaraS3 = new S3Client({
  region: "default",
  endpoint: env.LIARA_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.LIARA_ACCESS_KEY,
    secretAccessKey: env.LIARA_SECRET_KEY,
  },
});

export const LIARA_BUCKET_NAME = env.LIARA_BUCKET_NAME;

// لینک عمومیِ قابل نمایش برای یک فایل داخل باکت (باکت باید Public باشه)
export function buildPublicUrl(key: string): string {
  return `${env.LIARA_ENDPOINT.replace(/\/$/, "")}/${LIARA_BUCKET_NAME}/${key}`;
}
