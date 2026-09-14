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

  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(compression());

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
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(mongoSanitize());

  // --- تنظیم سرو کردن فایل‌های استاتیک در بالاترین اولویت ---
  app.use(
    express.static(path.join(process.cwd(), "public"), {
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );
  // ----------------------------------------------------

  app.use(morgan("dev"));

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

  app.get("/", (_req, res) => {
    res.status(200).json({
      status: "online",
      message: "Sedighi Tile API is running successfully 🚀",
      docs: "/api-docs",
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      status: "healthy",
    });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api/settings", settingRoutes);
  app.use("/api/about", aboutRoutes);
  app.use("/api/magazine", magazineRoutes);
  app.use("/api/home", homeRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use("/tile-finder", tileFinderRoutes);
  app.use("/api/tile-finder-steps", tileFinderStepRoutes);

  app.use(sitemapRoutes);

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

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
