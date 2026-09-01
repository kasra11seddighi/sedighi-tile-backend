import fs from "fs";
import path from "path";

/**
 * عکس‌های خامِ اتاق (uploads/rooms) بلافاصله بعد از پردازش هر درخواست
 * پاک می‌شن (در roomVisualizer.controller.ts). اما عکس‌های نتیجه‌ی نهایی
 * (uploads/results) عمداً نگه داشته می‌شن چون کاربر باید بتونه بعد از
 * دریافت پاسخ، لینکش رو باز/دانلود کنه؛ در نتیجه این پوشه با گذشت زمان
 * بزرگ می‌شه.
 *
 * این اسکریپت فایل‌های قدیمی‌تر از MAX_AGE_DAYS رو از uploads/results
 * پاک می‌کنه. پیشنهاد می‌شه با یک cron job روزانه اجرا بشه، مثلاً:
 *   0 3 * * * cd /path/to/backend && npm run cleanup:uploads
 */

const RESULTS_DIR = path.join(process.cwd(), "public", "uploads", "results");
const MAX_AGE_DAYS = 7;

const run = (): void => {
  if (!fs.existsSync(RESULTS_DIR)) {
    console.log("پوشه‌ی uploads/results وجود نداره؛ کاری برای پاک‌سازی نیست.");
    return;
  }

  const maxAgeMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const files = fs.readdirSync(RESULTS_DIR);

  let deleted = 0;
  for (const file of files) {
    const filePath = path.join(RESULTS_DIR, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > maxAgeMs) {
      fs.unlinkSync(filePath);
      deleted += 1;
    }
  }

  console.log(`✅ پاک‌سازی انجام شد. ${deleted} فایل قدیمی‌تر از ${MAX_AGE_DAYS} روز حذف شد.`);
};

run();
