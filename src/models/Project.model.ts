import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  location: string;
  completedAt?: Date;
  coverImage: string;
  images: string[];
  category: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    location: { type: String, default: "", trim: true },
    completedAt: { type: Date },
    coverImage: { type: String, required: [true, "تصویر شاخص پروژه الزامی است"] },
    images: [{ type: String }],

    category: {
      type: Schema.Types.ObjectId,
      ref: "ProjectCategory",
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// جستجوی متنی، دقیقاً هم‌الگو با productSchema.index({ name: "text", ... })
projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ category: 1 });

export const Project = model<IProject>("Project", projectSchema);
