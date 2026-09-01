import "dotenv/config";
import { connectDB } from "../config/db";
import { Product } from "../models/Product.model";
import { Category } from "../models/Category.model";
import { slugify } from "../utils/slugify";
import mongoose from "mongoose";

// این سید فقط چند محصول تستی برای سیستم فروش متری/کارتنی می‌سازه؛
// دسته‌بندی «کاشی و سرامیک» رو اگه از قبل نباشه، خودش می‌سازه.
async function createTileProducts(): Promise<void> {
  try {
    await connectDB();

    let category = await Category.findOne({ name: "کاشی و سرامیک" });
    if (!category) {
      category = await Category.create({
        name: "کاشی و سرامیک",
        slug: slugify("کاشی و سرامیک"),
        description: "انواع کاشی و سرامیک دیوار و کف",
      });
    }

    const products = [
      {
        name: "سرامیک ۶۰×۶۰ ماربل (متری و کارتنی)",
        description: "سرامیک طرح ماربل، مناسب کف و دیوار، قابل خرید متری یا کارتنی.",
        price: 350000,
        stock: 200, // بر حسب کارتن
        category: category._id,
        isActive: true,
        pricePerM2: 350000,
        pricePerCarton: 504000,
        piecesPerCarton: 4,
        m2PerCarton: 1.44,
        tileWidth: 60,
        tileHeight: 60,
        saleUnit: "both" as const,
      },
      {
        name: "کاشی دیواری ۲۵×۴۰ (فقط متری)",
        description: "کاشی دیواری سفید ساده، فقط به‌صورت متری فروخته می‌شود.",
        price: 280000,
        stock: 500,
        category: category._id,
        isActive: true,
        pricePerM2: 280000,
        piecesPerCarton: 8,
        m2PerCarton: 0.8,
        tileWidth: 25,
        tileHeight: 40,
        saleUnit: "m2" as const,
      },
      {
        name: "پرسلان ۸۰×۸۰ (فقط کارتنی)",
        description: "پرسلان بزرگ درجه یک، فقط به‌صورت کارتنی فروخته می‌شود.",
        price: 720000,
        stock: 150,
        category: category._id,
        isActive: true,
        pricePerCarton: 1036800,
        piecesPerCarton: 2,
        m2PerCarton: 1.28,
        tileWidth: 80,
        tileHeight: 80,
        saleUnit: "carton" as const,
      },
    ];

    for (const p of products) {
      const existing = await Product.findOne({ name: p.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, p);
      } else {
        await Product.create({ ...p, slug: slugify(p.name) });
      }
    }

    console.log("✅ Tile products (m2 / carton / both) seeded");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createTileProducts();
