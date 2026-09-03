import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { User } from "./models/User.model";

const start = async (): Promise<void> => {
  try {
    const app = createApp();
    const port = Number(env.PORT) || 3000;

    // اتصال و گوش دادن روی 0.0.0.0 برای محیط‌های ابری/داکر
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    // اتصال به دیتابیس MongoDB
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // همگام‌سازی ایندکس‌ها در محیط غیر پروداکشن
    if (env.NODE_ENV !== "production") {
      await User.syncIndexes();
      console.log("✅ User indexes synchronized");
    }

    // مدیریت خروج امن (Graceful Shutdown)
    const handleShutdown = (signal: string) => {
      console.log(`⚠️ Received ${signal}, closing server...`);
      server.close(() => {
        console.log("🛑 Server closed cleanly");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Application startup failed:", error);
    process.exit(1);
  }
};

void start();
