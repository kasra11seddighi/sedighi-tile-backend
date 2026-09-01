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

  // فیلدهای مربوط به فوتر - همون سند تنظیمات، هم برای هدر هم فوتر استفاده می‌شه
  description?: string;
  quickLinks?: IMenuItem[];
  helpLinks?: IMenuItem[];
  social?: ISocialLinks;
  contact?: IContactInfo;

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
  },
  { timestamps: true },
);

export const Setting = model<ISetting>("Setting", settingSchema);
