import "dotenv/config";
import { connectDB } from "../config/db";
import { Project } from "../models/Project.model";
import { ProjectCategory } from "../models/ProjectCategory.model";
import { slugify } from "../utils/slugify";
import mongoose from "mongoose";

// چند پروژه‌ی تستی برای بررسی end-to-end صفحه‌ی /projects؛ دسته‌بندی
// «کاشی و سرامیک» رو اگه از قبل نباشه، خودش می‌سازه.
async function createProjects(): Promise<void> {
  try {
    await connectDB();

    let category = await ProjectCategory.findOne({ name: "کاشی و سرامیک" });
    if (!category) {
      category = await ProjectCategory.create({
        name: "کاشی و سرامیک",
        slug: slugify("کاشی و سرامیک"),
        description: "پروژه‌های اجراشده با کاشی و سرامیک",
      });
    }

    const projects = [
      {
        title: "نوسازی نمای ساختمان مسکونی، شریعتی",
        description:
          "اجرای کامل کاشی‌کاری نمای بیرونی یک ساختمان ۶ طبقه با سرامیک ۶۰×۶۰ ماربل.",
        location: "تهران، شریعتی",
        completedAt: new Date("2025-11-01"),
        coverImage: "/uploads/projects/sample-1.jpg",
        images: [],
        category: category._id,
        isActive: true,
      },
      {
        title: "بازسازی حمام و سرویس بهداشتی ویلایی",
        description:
          "طراحی و اجرای کاشی و سرامیک حمام با ترکیب رنگ روشن و شیرآلات مدرن.",
        location: "کرج، مشکین‌دشت",
        completedAt: new Date("2025-08-15"),
        coverImage: "/uploads/projects/sample-2.jpg",
        images: [],
        category: category._id,
        isActive: true,
      },
      {
        title: "کف‌سازی سالن فروشگاه تجاری",
        description:
          "اجرای کف پرتردد با سرامیک کارتنی مقاوم در برابر سایش برای یک فروشگاه ۲۰۰ متری.",
        location: "تهران، تجریش",
        completedAt: new Date("2025-05-20"),
        coverImage: "/uploads/projects/sample-3.jpg",
        images: [],
        category: category._id,
        isActive: true,
      },
    ];

    for (const p of projects) {
      const existing = await Project.findOne({ title: p.title });
      if (existing) {
        await Project.updateOne({ _id: existing._id }, p);
      } else {
        await Project.create({ ...p, slug: slugify(p.title) });
      }
    }

    console.log("✅ Projects seeded");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createProjects();
