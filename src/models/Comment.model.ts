import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  product: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  email?: string;
  text: string;
  rating?: number;
  isApproved: boolean;
  adminReply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "شناسه محصول الزامی است"],
      index: true, // برای سریع بودن کوئری «کامنت‌های یک محصول»
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: [true, "نام الزامی است"], trim: true },
    email: { type: String, trim: true },
    text: { type: String, required: [true, "متن نظر الزامی است"], trim: true },
    rating: { type: Number, min: 1, max: 5 },

    // نظرات تا وقتی ادمین تاییدشون نکنه توی سایت عمومی نمایش داده نمی‌شن
    isApproved: { type: Boolean, default: false },

    // پاسخ ادمین به نظر کاربر
    adminReply: { type: String, trim: true, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true },
);

export const Comment = model<IComment>("Comment", commentSchema);
