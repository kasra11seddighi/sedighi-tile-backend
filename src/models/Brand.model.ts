import { Schema, model, Document, Types } from "mongoose";

export interface IBrand extends Document {
  _id: Types.ObjectId;
  name: string;
  logo: string;
  shortDescription: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, "نام برند الزامی است"],
      trim: true,
    },
    logo: {
      type: String,
      required: [true, "لوگوی برند الزامی است"],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, "توضیح کوتاه برند الزامی است"],
      trim: true,
      maxlength: [180, "توضیح برند نمی‌تواند بیشتر از ۱۸۰ کاراکتر باشد"],
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Brand = model<IBrand>("Brand", brandSchema);
