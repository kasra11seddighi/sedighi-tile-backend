import "dotenv/config";
import { connectDB } from "../config/db";
import { Faq } from "../models/Faq.model";
import mongoose from "mongoose";

async function createFaqs(): Promise<void> {
  try {
    await connectDB();

    await Faq.deleteMany();

    await Faq.insertMany([
      {
        question: "چطور می‌تونم سفارش خودم رو ثبت کنم؟",
        answer:
          "کافیه محصول مورد نظرت رو به سبد خرید اضافه کنی و مراحل پرداخت رو تکمیل کنی. بعد از ثبت سفارش، پیامک تایید برات ارسال می‌شه.",
        order: 1,
      },
      {
        question: "هزینه و زمان ارسال چقدره؟",
        answer:
          "ارسال به سراسر کشور انجام می‌شه. هزینه و زمان تحویل بسته به شهر مقصد متفاوته و در مرحله‌ی نهایی خرید نمایش داده می‌شه.",
        order: 2,
      },
      {
        question: "آیا امکان مرجوع کردن کالا وجود داره؟",
        answer:
          "بله، در صورتی که کالا آسیب‌دیده یا مغایر با سفارش باشه، تا ۷۲ ساعت پس از تحویل امکان مرجوعی وجود داره.",
        order: 3,
      },
      {
        question: "چطور می‌تونم با پشتیبانی تماس بگیرم؟",
        answer:
          "از طریق فرم تماس با ما در همین صفحه، یا شماره تماسی که در فوتر سایت درج شده، می‌تونی با تیم پشتیبانی در ارتباط باشی.",
        order: 4,
      },
      {
        question: "آیا کاشی‌یاب هوشمند سایت رایگانه؟",
        answer:
          "بله، ابزار کاشی‌یاب و شبیه‌ساز اتاق با هوش مصنوعی کاملاً رایگان و بدون نیاز به ثبت‌نام قابل استفاده‌ست.",
        order: 5,
      },
    ]);

    console.log("✅ FAQs created");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createFaqs();
