import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import compression from "compression";
import path from "path";

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
import uploadRoutes from "./routes/upload.routes";
import settingRoutes from "./routes/setting.routes";
import tileFinderRoutes from "./routes/tileFinder.routes";
import roomVisualizerRoutes from "./routes/roomVisualizer.routes";
import contactMessageRoutes from "./routes/contactMessage.routes";
import faqRoutes from "./routes/faq.routes";
import commentRoutes from "./routes/comment.routes";
import tileFinderOptionRoutes from "./routes/tileFinderOption.routes";
import tileFinderStepRoutes from "./routes/tileFinderStep.routes";
import productSortOptionRoutes from "./routes/productSortOption.routes";
import projectRoutes from "./routes/project.routes";
import projectCategoryRoutes from "./routes/projectCategory.routes";
import aboutRoutes from "./routes/about.routes";
import magazineRoutes from "./routes/magazine.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import yardBannerRoutes from "./routes/yardBanner.routes";
import sitemapRoutes from "./routes/sitemap.routes";

export const createApp = (): Express => {
  const app = express();

  // پشت یک ریورس‌پروکسی/لودبالانسر (nginx, Render, Railway, Vercel و...) که
  // TLS رو خودش terminate می‌کنه، به‌صورت پیش‌فرض Express فکر می‌کنه درخواست
  // http هست (چون به خودِ Node واقعاً رمزنگاری‌شده نمی‌رسه). با فعال‌کردن
  // trust proxy، مقدار هدر X-Forwarded-Proto رو می‌خونه تا req.secure درست
  // محاسبه بشه؛ این مقدار مستقیماً روی تصمیم Secure/SameSite کوکی توکن
  // (پایین‌تر توی auth.controller) تأثیر می‌ذاره.
  app.set("trust proxy", 1);

  // هدرهای امنیتی پایه
  // CSP غیرفعال شده چون تنظیم پیش‌فرض Helmet با Swagger UI تداخل دارد
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  // فشرده‌سازی پاسخ‌ها با gzip/brotli
  app.use(compression());

  // Originهای مجاز فرانت‌اند
  const allowedOrigins = env.CLIENT_URL.split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes("*") ||
          allowedOrigins.includes(origin)
        ) {
          callback(null, true);
          return;
        }

        callback(new Error("این origin توسط CORS مجاز نیست."));
      },
      // چون توکن حالا توی کوکی httpOnly ست می‌شه، مرورگر باید اجازه‌ی
      // فرستادن/دریافت کوکی رو بین origin فرانت و بک‌اند داشته باشه.
      // نکته: وقتی credentials:true هست، origin نمی‌تونه "*" باشه؛
      // پس CLIENT_URL حتماً باید آدرس دقیق فرانت باشه.
      credentials: true,
    }),
  );

  // خوندن کوکی‌های درخواست (برای خوندن توکن احراز هویت از کوکی httpOnly)
  app.use(cookieParser());

  // پردازش بدنه JSON درخواست‌ها
  app.use(express.json());

  // لایه دفاعی در برابر NoSQL Injection
  // باید بعد از express.json قرار بگیرد تا body قبلاً پردازش شده باشد
  app.use(mongoSanitize());

  // ثبت درخواست‌ها در محیط توسعه
  app.use(morgan("dev"));

  // محدودکننده عمومی نرخ درخواست‌های API
  const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.",
    },
  });

  app.use("/api", apiRateLimit);

  // روت اصلی
  app.get("/", (_req, res) => {
    res.status(200).json({
      status: "online",
      message: "Sedighi Tile API is running successfully 🚀",
      docs: "/api-docs",
    });
  });

  // Health check عمومی
  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      status: "healthy",
    });
  });

  // مستندات Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api/settings", settingRoutes);
  app.use("/api/about", aboutRoutes);
  app.use("/api/magazine", magazineRoutes);

  /*
   * فایل‌های استاتیک داخل پوشه public
   *
   * استفاده از path.join(process.cwd(), "public") جهت اطمینان از صحت مسیر
   * در محیط Production پس از کامپایل TypeScript به dist.
   */
  app.use(
    express.static(path.join(process.cwd(), "public"), {
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );

  app.use("/api/home", homeRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use("/tile-finder", tileFinderRoutes);
  app.use("/api/tile-finder-steps", tileFinderStepRoutes);

  // بیرون از "/api" mount می‌شه تا آدرس نهایی دقیقاً
  // https://kashiseddighi.ir/sitemap.xml باشه، بدون نیاز به پراکسی/ریرایت جدا
  app.use(sitemapRoutes);

  // Health check مربوط به API
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "سرور فعال است 🚀",
    });
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
  app.use("/api/testimonials", testimonialRoutes);
  app.use("/api/yard-banners", yardBannerRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/tile-finder-options", tileFinderOptionRoutes);
  app.use("/api/product-sort-options", productSortOptionRoutes);
  app.use("/api/project-categories", projectCategoryRoutes);

  // مدیریت روت‌های پیدا نشده و خطاهای برنامه
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
