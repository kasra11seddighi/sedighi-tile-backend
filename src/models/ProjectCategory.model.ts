import { Schema, model, Document, Types } from "mongoose";

export interface IProjectCategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectCategorySchema = new Schema<IProjectCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ProjectCategory = model<IProjectCategory>(
  "ProjectCategory",
  projectCategorySchema,
);
