import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { User } from "./models/User.model";

const start = async (): Promise<void> => {
  await connectDB();

  // فقط توی dev: ایندکس‌های کالکشن users رو با اسکیمای فعلی sync می‌کنیم
  // تا ایندکس‌های قدیمیِ حذف‌شده از مدل (مثل email که قبلاً بوده و پاک شده)
  // توی خودِ دیتابیس باقی نمونن و باعث خطای duplicate key نشن.
  if (env.NODE_ENV !== "production") {
    await User.syncIndexes();
  }

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

start();
