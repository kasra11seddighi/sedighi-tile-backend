import "dotenv/config";
import { connectDB } from "../config/db";
import { Testimonial } from "../models/Testimonial.model";
import mongoose from "mongoose";

async function createTestimonials(): Promise<void> {
  try {
    await connectDB();

    await Testimonial.deleteMany();

    await Testimonial.insertMany([
      {
        name: "علی محمدی",
        role: "معمار",
        rating: 5,
        comment:
          "کیفیت کاشی‌ها فوق‌العاده بود و مشاوره‌ی تیمشون کمک زیادی کرد تا بهترین گزینه رو برای پروژه‌ی مسکونیم انتخاب کنم.",
        order: 1,
      },
      {
        name: "سارا احمدی",
        role: "تهران",
        rating: 5,
        comment:
          "ارسال خیلی سریع بود و بسته‌بندی هم عالی، هیچ کدوم از کاشی‌ها آسیب ندیده بودن. حتماً دوباره خرید می‌کنم.",
        order: 2,
      },
      {
        name: "رضا کریمی",
        role: "طراح داخلی",
        rating: 4,
        comment:
          "تنوع برندها زیاده و قیمت‌ها منصفانه‌ست. کاشی‌یاب هوشمند سایت هم واقعاً توی انتخاب کمک‌کننده بود.",
        order: 3,
      },
    ]);

    console.log("✅ Testimonials created");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createTestimonials();
