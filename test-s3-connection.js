// اسکریپت تست مستقل - فقط برای عیب‌یابی اتصال Object Storage
// اجرا: node test-s3-connection.js
// (باید تو ریشه‌ی پروژه، جایی که @aws-sdk/client-s3 نصبه اجرا بشه)

const { S3Client, ListObjectsV2Command, PutObjectCommand } = require("@aws-sdk/client-s3");

// مقادیر واقعی خودت رو اینجا موقتاً جایگزین کن (فقط برای تست لوکال - بعد از تست پاکشون کن)
const ENDPOINT = "https://c212260.parspack.net";
const ACCESS_KEY = "PUT_YOUR_NEW_ACCESS_KEY_HERE";
const SECRET_KEY = "PUT_YOUR_NEW_SECRET_KEY_HERE";
const BUCKET_NAME = "c212260";

async function main() {
  const client = new S3Client({
    region: "default",
    endpoint: ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  console.log("در حال تست ListObjects...");
  try {
    const list = await client.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME }));
    console.log("✅ ListObjects موفق بود. تعداد فایل‌ها:", list.KeyCount);
  } catch (err) {
    console.error("❌ ListObjects شکست خورد:");
    console.error(err);
    return;
  }

  console.log("\nدر حال تست آپلود یک فایل تستی...");
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: "test/hello.txt",
        Body: "salam",
        ContentType: "text/plain",
        ACL: "public-read",
      }),
    );
    console.log("✅ آپلود موفق بود!");
    console.log("لینک تستی:", `${ENDPOINT}/${BUCKET_NAME}/test/hello.txt`);
  } catch (err) {
    console.error("❌ آپلود شکست خورد:");
    console.error(err);
  }
}

main();
