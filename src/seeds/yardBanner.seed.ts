import "dotenv/config";
import { connectDB } from "../config/db";
import { YardBanner } from "../models/YardBanner.model";
import { Category } from "../models/Category.model";
import mongoose from "mongoose";

// برای هر بنر، چند تا نام محتمل برای دسته‌بندی امتحان می‌کنیم (چون نمی‌دونیم
// دقیقاً چه اسمی توی کالکشن categories ثبت شده)؛ اولین موردی که پیدا بشه
// استفاده می‌شه. اگه هیچ‌کدوم پیدا نشه، بنر بدون link ساخته می‌شه و لیست
// دسته‌بندی‌های موجود توی کنسول چاپ می‌شه تا خودت اسم درست رو جایگزین کنی.
const YARD_BANNERS = [
  {
    image: "/images/yard/banner1.jpg",
    title: "کاشی استخر",
    subtitle: "مقاوم در برابر رطوبت و لیز نخوردن",
    alt: "کاشی استخر",
    order: 1,
    categoryNames: ["کاشی استخر", "استخر"],
  },
  {
    image: "/images/yard/banner2.jpg",
    title: "کاشی نما",
    subtitle: "دوام در برابر شرایط جوی",
    alt: "کاشی نما",
    order: 2,
    categoryNames: ["کاشی نما", "نما"],
  },
  {
    image: "/images/yard/banner3.jpg",
    title: "کاشی حیاط",
    subtitle: "طراحی شیک برای فضای باز",
    alt: "کاشی حیاط",
    order: 3,
    categoryNames: ["کاشی حیاط", "حیاط", "کاشی حیاط‌سازی"],
  },
];

async function resolveCategoryLink(names: string[]): Promise<string | undefined> {
  for (const name of names) {
    const category = await Category.findOne({ name });
    if (category) return `/products?category=${category._id}`;
  }
  return undefined;
}

async function createYardBanners(): Promise<void> {
  try {
    await connectDB();

    await YardBanner.deleteMany();

    const allCategories = await Category.find().select("name");
    const missing: string[] = [];

    const docs = [];
    for (const banner of YARD_BANNERS) {
      const link = await resolveCategoryLink(banner.categoryNames);
      if (!link) missing.push(banner.title);

      docs.push({
        image: banner.image,
        title: banner.title,
        subtitle: banner.subtitle,
        alt: banner.alt,
        order: banner.order,
        isActive: true,
        ...(link ? { link } : {}),
      });
    }

    await YardBanner.insertMany(docs);

    console.log("✅ Yard banners created");

    if (missing.length > 0) {
      console.log(
        `\n⚠️  برای این بنرها دسته‌بندی مطابقی پیدا نشد و بدون link ساخته شدن: ${missing.join(", ")}`,
      );
      console.log("دسته‌بندی‌های موجود توی دیتابیس:");
      allCategories.forEach((c) => console.log(`  - ${c.name}`));
      console.log(
        "\nاگه اسم درست بین این‌هاست، توی src/seeds/yardBanner.seed.ts آرایه‌ی categoryNames همون بنر رو تصحیح کن و دوباره اجرا کن.",
      );
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createYardBanners();
