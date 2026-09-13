import "dotenv/config";
import { connectDB } from "../config/db";
import { Setting } from "../models/Setting.model";
import mongoose from "mongoose";

async function createSetting(): Promise<void> {
  try {
    await connectDB();

    await Setting.deleteMany();

    await Setting.create({
      logo: "نمایندگی صدیقی",
      headerTitle: "فروشگاه تخصصی کاشی و سرامیک",
      headerSubtitle: "صدیقی",
      menu: [
        { title: "محصولات", path: "/products" },
        { title: "مجلات", path: "/magazine" },
        { title: "پروژه‌ها", path: "/projects" },
        { title: "درباره ما", path: "/about" },
        { title: "تماس", path: "/contact" },
      ],

      description:
        "تأمین‌کننده‌ی تخصصی کاشی، سرامیک و شیرآلات با گزینه‌های متنوع از برندهای معتبر؛ از انتخاب تا نصب، همراه شما هستیم.",
      quickLinks: [
        { title: "خانه", path: "/" },
        { title: "محصولات", path: "/products" },
        { title: "مجلات", path: "/magazine" },
        { title: "کاشی‌یاب هوشمند", path: "/#tile-finder" },
        { title: "شیرآلات", path: "/#shiralat" },
        { title: "سبد خرید", path: "/cart" },
      ],
      helpLinks: [
        { title: "درباره ما", path: "/about" },
        { title: "تماس با ما", path: "/contact" },
        { title: "شرایط و قوانین", path: "/terms" },
        { title: "حریم خصوصی", path: "/privacy" },
        { title: "سوالات متداول", path: "/faq" },
      ],
      social: {
        instagram: "https://instagram.com/",
        telegram: "https://t.me/",
        whatsapp: "",
      },
      contact: {
        phone: "021-XXXXXXXX",
        email: "info@sedighi-tile.ir",
        address: "تهران، خیابان نمونه، پلاک ۰",
      },
      // فعلاً سبد خرید/چک‌اوت خاموشه؛ از داشبورد ادمین قابل روشن کردنه
      cartEnabled: false,
      // فعلاً بخش شیرآلات هم خاموشه؛ از داشبورد ادمین قابل روشن کردنه
      shiralatEnabled: false,
    });

    console.log("✅ Setting created");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createSetting();
