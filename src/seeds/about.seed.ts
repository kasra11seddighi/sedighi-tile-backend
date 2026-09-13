import "dotenv/config";
import { connectDB } from "../config/db";
import { About } from "../models/About.model";
import mongoose from "mongoose";

async function createAbout(): Promise<void> {
  try {
    await connectDB();

    await About.deleteMany();

    await About.create({
      hero: {
        badge: "درباره‌ی نمایندگی صدیقی",
        titleBefore: "داستان ما از عشق به",
        titleHighlight: "کاشی و سرامیک",
        titleAfter: "شروع شد",
        description:
          "نمایندگی صدیقی سال‌هاست در کنار معماران، طراحان داخلی و خانواده‌های ایرانی، برای ساختن فضاهایی زیباتر تلاش می‌کند. از انتخاب تا نصب، مشاور و همراه شما هستیم.",
      },
      stats: [
        { icon: "Award", value: "۱۵+", label: "سال تجربه" },
        { icon: "Users", value: "۵۰۰۰+", label: "مشتری راضی" },
        { icon: "Building2", value: "۲۰۰+", label: "پروژه اجرا شده" },
        { icon: "PackageCheck", value: "۵۰+", label: "برند معتبر" },
      ],
      story: {
        badge: "داستان ما",
        title: "از یک فروشگاه کوچک، تا یک نام معتبر",
        paragraph1:
          "نمایندگی صدیقی فعالیت خودش رو با یک هدف ساده شروع کرد: دسترسی راحت‌تر به کاشی و سرامیک باکیفیت، بدون واسطه‌های اضافه. با گذر زمان و اعتماد مشتری‌ها، امروز مجموعه‌ای از برندهای معتبر داخلی و خارجی رو زیر یک سقف جمع کرده‌ایم.",
        paragraph2:
          "هدف ما فقط فروش نیست؛ کمک به این هستیم که فضایی رو که در ذهن داری، دقیقاً همون‌طور که تصورش رو کردی بسازی — از انتخاب رنگ و متریال گرفته تا نصب نهایی.",
        image: "https://placehold.co/800x600/0d1520/8a93a6?text=نمایشگاه+صدیقی",
        experienceValue: "+۱۵",
        experienceLabel: "سال تجربه",
      },
      values: {
        badge: "چرا نمایندگی صدیقی",
        title: "تجربه‌ی خریدی که می‌تونی بهش اعتماد کنی",
        items: [
          {
            icon: "ShieldCheck",
            title: "کیفیت تضمین‌شده",
            description:
              "تمام محصولات پیش از عرضه از نظر کیفیت و استاندارد بررسی می‌شن.",
          },
          {
            icon: "Headset",
            title: "مشاوره تخصصی رایگان",
            description:
              "تیم ما در انتخاب کاشی، سرامیک و شیرآلات مناسب فضای شما کمکتون می‌کنه.",
          },
          {
            icon: "Truck",
            title: "ارسال سریع و مطمئن",
            description: "ارسال به سراسر کشور با بسته‌بندی استاندارد و بدون آسیب.",
          },
          {
            icon: "BadgeCheck",
            title: "ضمانت اصالت کالا",
            description: "همکاری مستقیم با برندهای معتبر، بدون واسطه و کالای غیراصل.",
          },
        ],
      },
      cta: {
        title: "برای مشاوره‌ی رایگان با ما در تماس باش",
        description:
          "تیم ما آماده‌ست تا بهترین گزینه رو متناسب با فضا، بودجه و سلیقه‌ی تو پیشنهاد بده.",
      },
    });

    console.log("✅ About content created");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createAbout();
