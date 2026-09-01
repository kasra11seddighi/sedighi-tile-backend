import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { notFound, errorHandler } from "./middlewares/errorHandler.middleware";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import favoriteRoutes from "./routes/favorite.routes";
import orderRoutes from "./routes/order.routes";
import homeRoutes from "./routes/home.routes";
import brandRoutes from "./routes/brand.routes";
import settingRoutes from "./routes/setting.routes";
import tileFinderRoutes from "./routes/tileFinder.routes";
import roomVisualizerRoutes from "./routes/roomVisualizer.routes";
import contactMessageRoutes from "./routes/contactMessage.routes";
import faqRoutes from "./routes/faq.routes";
import commentRoutes from "./routes/comment.routes";
import tileFinderOptionRoutes from "./routes/tileFinderOption.routes";
import productSortOptionRoutes from "./routes/productSortOption.routes";
import projectRoutes from "./routes/project.routes";
import projectCategoryRoutes from "./routes/projectCategory.routes";

export const createApp = (): Express => {
  const app = express();

  // CLIENT_URL می‌تونه چند آدرس، جدا با کاما، باشه (مثلاً فرانت فروشگاه +
  // پنل مدیریت که یه اپ کاملاً جداست): CLIENT_URL=http://localhost:5173,http://localhost:5174
  // قبلاً فقط یه origin رو قبول می‌کرد و درخواست از origin دومی (مثلاً پنل
  // مدیریت رو یه پورت دیگه) با خطای CORS رد می‌شد - همون چیزی که باعث
  // «ارسال کد با خطا مواجه شد» تو فرانت می‌شد چون اصلاً پاسخی به مرورگر نمی‌رسید.
  const allowedOrigins = env.CLIENT_URL.split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // درخواست‌های بدون origin (مثل curl/Postman) یا وقتی CLIENT_URL="*"ه
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("این origin توسط CORS مجاز نیست."));
        }
      },
    }),
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api/settings", settingRoutes);

  // فایل‌های استاتیک (تصاویر محصولات و غیره)
  app.use(express.static("public"));

  app.use("/api/home", homeRoutes);
  app.use("/api/brands", brandRoutes);

  // توجه: tile-finder عمداً بدون پیشوند /api mount شده
  // چون فرانت فعلی همین مسیر را صدا می‌زند.
  app.use("/tile-finder", tileFinderRoutes);

  // سلامت سرور
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, message: "سرور فعال است 🚀" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/favorites", favoriteRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/room-visualizer", roomVisualizerRoutes);
  app.use("/api/contact-messages", contactMessageRoutes);
  app.use("/api/faqs", faqRoutes);
  app.use("/api/comments", commentRoutes);

  // مدیریت گزینه‌های کاشی‌یاب از پنل ادمین (فضا/سایز/سبک/رنگ)
  // جدا از /tile-finder عمومی که فقط خواندنی و برای ویزارد فرانت است
  app.use("/api/tile-finder-options", tileFinderOptionRoutes);

  // مدیریت گزینه‌های مرتب‌سازی محصولات از پنل ادمین (لیست کامل + CRUD)
  // جدا از /api/products/sort-options عمومی که فقط خواندنی و برای
  // دراپ‌داون مرتب‌سازی صفحه‌ی محصولات است
  app.use("/api/product-sort-options", productSortOptionRoutes);

  // مدیریت دسته‌بندی‌های پروژه از پنل ادمین (لیست کامل + CRUD)
  // جدا از /api/projects/categories عمومی که فقط خواندنی و برای
  // فیلتر دسته‌بندی صفحه‌ی پروژه‌هاست
  app.use("/api/project-categories", projectCategoryRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
