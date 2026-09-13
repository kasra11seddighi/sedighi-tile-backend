import { Schema, model, Document } from "mongoose";

interface IMenuItem {
  title: string;
  path: string;
}

interface ISocialLinks {
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
}

interface IContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface ISetting extends Document {
  logo: string;
  menu: IMenuItem[];

  // عنوان و زیرعنوان نمایش داده شده در لوگوی هدر (جدا از «logo» که در فوتر
  // به‌عنوان نام برند استفاده می‌شه) - هر دو از پنل ادمین قابل ویرایشن.
  headerTitle?: string;
  headerSubtitle?: string;
  // عکس لوگو که به‌جای دایره‌ی طلایی پیش‌فرض (حرف «ک») توی هدر نشون داده
  // می‌شه. اگه خالی باشه، همون دایره‌ی پیش‌فرض جایگزینش می‌شه.
  logoImage?: string;

  // فیلدهای مربوط به فوتر - همون سند تنظیمات، هم برای هدر هم فوتر استفاده می‌شه
  description?: string;
  quickLinks?: IMenuItem[];
  helpLinks?: IMenuItem[];
  social?: ISocialLinks;
  contact?: IContactInfo;

  // آیا سبد خرید/چک‌اوت روی کل سایت فعاله یا نه. پیش‌فرض false: فعلاً
  // مثل شیرآلات (که هنوز فعال نیست) مخفیه و کاربر باید برای هر محصول
  // تماس بگیره؛ فقط از داشبورد ادمین قابل روشن/خاموش شدنه.
  cartEnabled: boolean;

  // آیا بخش «شیرآلات» در صفحه اصلی نمایش داده بشه یا نه؛ درست مثل
  // cartEnabled فقط از داشبورد ادمین قابل روشن/خاموش کردنه.
  shiralatEnabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    title: { type: String, required: true },
    path: { type: String, required: true },
  },
  { _id: false },
);

const settingSchema = new Schema<ISetting>(
  {
    logo: { type: String, required: true },
    menu: [menuItemSchema],

    headerTitle: { type: String, default: "فروشگاه تخصصی کاشی و سرامیک" },
    headerSubtitle: { type: String, default: "صدیقی" },
    logoImage: { type: String, default: "" },

    description: { type: String, default: "" },
    quickLinks: [menuItemSchema],
    helpLinks: [menuItemSchema],
    social: {
      instagram: { type: String, default: "" },
      telegram: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    cartEnabled: { type: Boolean, default: false },
    shiralatEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Setting = model<ISetting>("Setting", settingSchema);
