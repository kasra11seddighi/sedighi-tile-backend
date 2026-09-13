import { Schema, model, Document, Types } from "mongoose";

export interface IMagazine extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  readTime: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const magazineSchema = new Schema<IMagazine>(
  {
    title: {
      type: String,
      required: [true, "عنوان مقاله الزامی است"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "خلاصه‌ی مقاله الزامی است"],
      trim: true,
      maxlength: [280, "خلاصه نمی‌تواند بیشتر از ۲۸۰ کاراکتر باشد"],
    },
    content: {
      type: String,
      required: [true, "متن کامل مقاله الزامی است"],
    },
    coverImage: {
      type: String,
      required: [true, "عکس کاور الزامی است"],
      trim: true,
    },
    author: { type: String, default: "تیم صدیقی", trim: true },
    readTime: { type: String, default: "۵ دقیقه", trim: true },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Magazine = model<IMagazine>("Magazine", magazineSchema);
