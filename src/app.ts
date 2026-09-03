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
        } else {
          callback(new Error("این origin توسط CORS مجاز نیست."));
        }
      },
    }),
  );
  app.use(express.json());
  app.use(morgan("dev"));

  // روت‌های سلامت و ریشه
  app.get("/", (_req, res) => {
    res.status(200).json({
      status: "online",
      message: "Sedighi Tile API is running successfully 🚀",
      docs: "/api-docs",
    });
  });

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, status: "healthy" });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api/settings", settingRoutes);

  // فایل‌های استاتیک
  app.use(express.static("public"));

  app.use("/api/home", homeRoutes);
  app.use("/api/brands", brandRoutes);

  app.use("/tile-finder", tileFinderRoutes);

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

  app.use("/api/tile-finder-options", tileFinderOptionRoutes);
  app.use("/api/product-sort-options", productSortOptionRoutes);
  app.use("/api/project-categories", projectCategoryRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
